#!/usr/bin/env node

/**
 * Local CI simulation script
 * This script mimics what GitHub Actions will do
 */

const { execSync } = require('child_process');
const path = require('path');

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      encoding: 'utf-8'
    });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    return false;
  }
}

async function runCISimulation() {
  console.log('🚀 Running local CI simulation...\n');

  const steps = [
    {
      command: 'npm ci',
      description: 'Installing dependencies'
    },
    {
      command: 'npm run lint',
      description: 'Running ESLint'
    },
    {
      command: 'npm run format:check',
      description: 'Checking code formatting'
    },
    {
      command: 'npm run build',
      description: 'Building TypeScript'
    },
    {
      command: 'npm run test:full',
      description: 'Running all tests'
    }
  ];

  let allPassed = true;

  for (const step of steps) {
    const success = runCommand(step.command, step.description);
    if (!success) {
      allPassed = false;
      break;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All CI checks passed! Your code is ready for GitHub.');
  } else {
    console.log('💥 Some CI checks failed. Please fix the issues before pushing.');
    process.exit(1);
  }
  console.log('='.repeat(50));
}

// Validate that we're in the right directory
const packageJsonPath = path.join(__dirname, '..', 'package.json');
try {
  const packageJson = require(packageJsonPath);
  if (packageJson.name !== 'node-layout-switcher') {
    throw new Error('Wrong directory');
  }
} catch (error) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

runCISimulation().catch(console.error);
