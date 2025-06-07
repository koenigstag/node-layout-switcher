import { initKeyBindings } from './keyboard';
import { ASCII_ART, divider, version } from './constants';
import { configPath, createUserConfig, copyConfigToCurrentDir } from './config';

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(ASCII_ART);
  console.log(`\nVersion ${version}\n`);
  console.log('Usage:');
  console.log(
    '  node-layout-switcher                    Start the application',
  );
  console.log(
    '  node-layout-switcher --init-config      Create config.json in current directory',
  );
  console.log(
    '  node-layout-switcher --init-user-config Create config in user home directory',
  );
  console.log('  node-layout-switcher --help             Show this help');
  console.log('\nConfig file search order:');
  console.log('  1. CONFIG_PATH environment variable');
  console.log('  2. ./config.json (next to executable)');
  console.log('  3. ~/.node-layout-switcher/config.json');
  console.log('  4. ./assets/config.json (built-in)');
  console.log(
    '\n📋 Note: config.json will be auto-created next to executable if not found',
  );
  process.exit(0);
}

if (args.includes('--create-config')) {
  console.log('🛠️  Creating config.json in current directory...');
  copyConfigToCurrentDir();
  console.log('✏️  You can now edit this file to customize your settings.');
  process.exit(0);
}

if (args.includes('--init-user-config')) {
  console.log('🛠️  Creating user config...');
  const configPath = createUserConfig();
  console.log(`✅ User config created: ${configPath}`);
  console.log('✏️  You can now edit this file to customize your settings.');
  process.exit(0);
}

console.log(ASCII_ART);

console.log(`\nVersion ${version}`);

console.log(`\n📁 Using config: ${configPath}`);

console.log(`\n${divider}\n`);

initKeyBindings();

console.log(`\n🟢 Listening to key-bindings.`);
