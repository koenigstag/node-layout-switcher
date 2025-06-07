import { Lang } from './types';
import { uniq } from './utils';
import config from './config';

export const version = '1.2.0';

export const selectedLayoutsList: [Lang, Lang] = uniq(
  config.selectedTuple,
).slice(0, 2) as [Lang, Lang];

export const divider =
  '----------------------------------------------------------------------------------------';

export const ASCII_ART = `${divider}
|                                                                                      |
|     _                             _      _____         _ _       _                   |
|    | |                           | |    / ____|       (_) |     | |                  |
|    | |     __ _ _   _  ___  _   _| |_  | (_____      ___| |_ ___| |__   ___ _ __     |
|    | |    / _\` | | | |/ _ \\| | | | __|  \\___ \\ \\ /\\ / / | __/ __| '_ \\ / _ \\ '__|    |
|    | |___| (_| | |_| | (_) | |_| | |_   ____) \\ V  V /| | || (__| | | |  __/ |       |
|    |______\\__,_|\\__, |\\___/ \\__,_|\\__| |_____/ \\_/\\_/ |_|\\__\\___|_| |_|\\___|_|       |
|                  __/ |                                                               |
|                 |___/                                                                |
|                                                                                      |
|                 Layout Switcher - A tool to fix text layout easily.                  |
${divider}`;
