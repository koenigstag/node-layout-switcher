import path from 'path';
import { Config } from './types';

export const configPathEnv = process.env.CONFIG_PATH || '../assets/config.json';

export const configPath = configPathEnv.includes('.')
  ? path.resolve(__dirname, configPathEnv)
  : configPathEnv;

export const configDirectory = path.resolve(
  __dirname,
  path.dirname(configPath)
);

const config = require(configPath) as Config;

export default config;
