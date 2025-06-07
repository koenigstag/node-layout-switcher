import path from 'path';
import fs from 'fs';
import os from 'os';
import { Config } from './types';

// Default configuration - single source of truth
const DEFAULT_CONFIG: Config = {
  selectedTuple: ['en', 'ru'],
  langRegexps: {
    uk: '[а-яіїєґ]',
    ru: '[а-яё]',
    de: '[a-zäöüß]',
    fr: '[a-zàâäçèéêëîïôùûüÿñ]',
    cz: '[a-záčďéěíňóřšťúůýž]',
    pl: '[a-ząćęłńóśźż]',
    en: '[a-z]',
  },
  dictionaryPaths: {
    en: './assets/dictionaries/en.qwerty.json',
    ru: './assets/dictionaries/ru.qwerty.json',
    uk: './assets/dictionaries/uk.qwerty.json',
    de: './assets/dictionaries/de.qwertz.json',
    fr: './assets/dictionaries/fr.azerty.json',
    cz: './assets/dictionaries/cz.qwertz.json',
    pl: './assets/dictionaries/pl.qwerty.json',
  },
  keyBindings: {
    'Ctrl+Shift+P': {
      action: 'convertSelectedText',
      description: 'Press ${keyBinding} to convert selected text',
    },
  },
};

declare global {
  namespace NodeJS {
    interface Process {
      pkg?: unknown;
    }
  }
}

// For pkg executables, detect if we're in a packaged environment
const isPkg = !!process.pkg;

function findOrCreateConfigPath(): string {
  // Priority order for config file lookup:
  // 1. Environment variable CONFIG_PATH
  // 2. ./config.json (next to executable)
  // 3. ~/.node-layout-switcher/config.json (user home)
  // 4. ./assets/config.json (built-in default)

  const candidatePaths = [];

  // 1. Environment variable
  if (process.env.CONFIG_PATH) {
    candidatePaths.push(process.env.CONFIG_PATH);
  }

  if (isPkg) {
    const execDir = path.dirname(process.execPath);
    // 2. Next to executable
    candidatePaths.push(path.join(execDir, 'config.json'));
    // 3. User home directory
    candidatePaths.push(
      path.join(os.homedir(), '.node-layout-switcher', 'config.json'),
    );
    // 4. Built-in assets
    candidatePaths.push(path.join(execDir, 'assets', 'config.json'));
  } else {
    // Development mode
    // 2. ./config.json in current working directory
    candidatePaths.push(path.resolve('config.json'));
    // 3. ./config.json in project root (next to package.json)
    candidatePaths.push(path.resolve(__dirname, '../config.json'));
    // 4. Built-in assets
    candidatePaths.push(path.resolve(__dirname, '../assets/config.json'));
  }

  // Find first existing config file
  for (const configPath of candidatePaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  } // No config found - auto-create config.json
  if (isPkg) {
    const execDir = path.dirname(process.execPath);
    const autoConfigPath = path.join(execDir, 'config.json');
    const defaultConfigPath = path.join(execDir, 'assets', 'config.json');

    // Try to copy from assets first
    if (fs.existsSync(defaultConfigPath)) {
      fs.copyFileSync(defaultConfigPath, autoConfigPath);
      console.log(`📋 Auto-created config: ${autoConfigPath}`);
      console.log(`✏️  You can edit this file to customize your settings.`);
      return autoConfigPath;
    }

    // If assets/config.json doesn't exist, create default config programmatically
    try {
      fs.writeFileSync(
        autoConfigPath,
        JSON.stringify(DEFAULT_CONFIG, null, 2),
        'utf8',
      );
      console.log(`📋 Auto-created config: ${autoConfigPath}`);
      console.log(`✏️  You can edit this file to customize your settings.`);
      return autoConfigPath;
    } catch (error) {
      console.warn(`⚠️  Could not create config file: ${error}`);
    }
  } else {
    // Development mode - create config.json in project root
    const autoConfigPath = path.resolve(__dirname, '../config.json');
    const defaultConfigPath = path.resolve(__dirname, '../assets/config.json');

    // Try to copy from assets first
    if (fs.existsSync(defaultConfigPath)) {
      try {
        fs.copyFileSync(defaultConfigPath, autoConfigPath);
        console.log(`📋 Auto-created config: ${autoConfigPath}`);
        console.log(`✏️  You can edit this file to customize your settings.`);
        return autoConfigPath;
      } catch (error) {
        console.warn(`⚠️  Could not copy config file: ${error}`);
      }
    }

    // If assets/config.json doesn't exist or copy failed, create default config programmatically
    try {
      fs.writeFileSync(
        autoConfigPath,
        JSON.stringify(DEFAULT_CONFIG, null, 2),
        'utf8',
      );
      console.log(`📋 Auto-created config: ${autoConfigPath}`);
      console.log(`✏️  You can edit this file to customize your settings.`);
      return autoConfigPath;
    } catch (error) {
      console.warn(`⚠️  Could not create config file: ${error}`);
    }
  }

  // Fallback to default path
  const fallbackPath = isPkg
    ? path.join(path.dirname(process.execPath), 'assets', 'config.json')
    : path.resolve(__dirname, '../assets/config.json');

  console.log(`⚠️  No config found, using default: ${fallbackPath}`);
  return fallbackPath;
}

export const configPath = findOrCreateConfigPath();
export const configDirectory = path.dirname(configPath);

// Safe config loading with fallback
function loadConfig(configPath: string): Config {
  try {
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configContent) as Config;
    }
  } catch (error) {
    console.warn(`⚠️  Error loading config from ${configPath}: ${error}`);
  }

  // Return default config if loading fails
  return DEFAULT_CONFIG;
}

const config = loadConfig(configPath);

// Export default config for external use
export { DEFAULT_CONFIG };

// Utility functions for config management
export function createUserConfig(): string {
  const userConfigDir = path.join(os.homedir(), '.node-layout-switcher');
  const userConfigPath = path.join(userConfigDir, 'config.json');

  // Create directory if it doesn't exist
  if (!fs.existsSync(userConfigDir)) {
    fs.mkdirSync(userConfigDir, { recursive: true });
  }

  // Create user config if it doesn't exist
  if (!fs.existsSync(userConfigPath)) {
    const defaultConfigPath = isPkg
      ? path.join(path.dirname(process.execPath), 'assets', 'config.json')
      : path.resolve(__dirname, '../assets/config.json');

    if (fs.existsSync(defaultConfigPath)) {
      fs.copyFileSync(defaultConfigPath, userConfigPath);
    } else {
      // Fallback to programmatic config creation
      fs.writeFileSync(
        userConfigPath,
        JSON.stringify(DEFAULT_CONFIG, null, 2),
        'utf8',
      );
    }
    console.log(`📋 Created user config: ${userConfigPath}`);
  }

  return userConfigPath;
}

export function copyConfigToCurrentDir(): string {
  const currentConfigPath = isPkg
    ? path.join(path.dirname(process.execPath), 'config.json')
    : path.join(process.cwd(), 'config.json');

  if (!fs.existsSync(currentConfigPath)) {
    const defaultConfigPath = isPkg
      ? path.join(path.dirname(process.execPath), 'assets', 'config.json')
      : path.resolve(__dirname, '../assets/config.json');

    if (fs.existsSync(defaultConfigPath)) {
      fs.copyFileSync(defaultConfigPath, currentConfigPath);
    } else {
      // Fallback to programmatic config creation
      fs.writeFileSync(
        currentConfigPath,
        JSON.stringify(DEFAULT_CONFIG, null, 2),
        'utf8',
      );
    }
    console.log(`📋 Created config: ${currentConfigPath}`);
  }

  return currentConfigPath;
}

export default config;
