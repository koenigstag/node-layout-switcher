import clipboardy from 'clipboardy';
import { keyboard, Key } from '@nut-tree-fork/nut-js';
import { Dict, Lang } from './types';
import config, { configDirectory } from './config';
import { selectedLayoutsList } from './constants';
import fs from 'fs';
import path from 'path';

export function buildCharToKey(layout: Dict) {
  const map: Dict = {};
  for (const [key, val] of Object.entries(layout)) {
    map[val] = key;
  }
  return map;
}

export async function getDictionary(lang: Lang): Promise<Dict> {
  const dictPath = config.dictionaryPaths[lang];

  if (!dictPath) {
    throw new Error(`Dictionary path not found for language: ${lang}`);
  }

  const filePath = dictPath.includes('.')
    ? path.resolve(configDirectory, dictPath)
    : dictPath;

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Dictionary file not found for language: ${lang}. Path: ${filePath}`
    );
  }

  const json = await fs.promises.readFile(filePath, 'utf-8');

  const dict: Dict = JSON.parse(json);

  if (typeof dict !== 'object' || dict === null) {
    throw new Error(`Invalid dictionary format for language: ${lang}`);
  }

  return dict;
}

export function detectLayoutKey(text: string): Lang | undefined {
  const regexpsForLangs: Record<Lang, RegExp> = selectedLayoutsList.reduce(
    (acc, lang) => {
      acc[lang] = new RegExp(config.langRegexps[lang], 'i');
      return acc;
    },
    {} as Record<Lang, RegExp>
  );

  for (const [lang, regexp] of Object.entries(regexpsForLangs)) {
    if (regexp.test(text)) {
      return lang as Lang;
    }
  }

  return undefined;
}

export function remapText(
  text: string,
  fromLayout: Dict,
  toLayout: Dict,
  fromCharToKey: Dict
) {
  return [...text]
    .map((ch) => {
      const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
      const lowerChar = ch.toLowerCase();
      const key = fromCharToKey[lowerChar];
      if (!key) return ch;

      let mapped = toLayout[key] || ch;
      if (isUpper) mapped = mapped.toUpperCase();
      return mapped;
    })
    .join('');
}

export async function copyText(): Promise<string> {
  await keyboard.pressKey(Key.LeftControl, Key.C);
  // Wait for clipboard to update
  await new Promise((resolve) => setTimeout(resolve, 50));
  await keyboard.releaseKey(Key.C, Key.LeftControl);

  const text = await clipboardy.read();

  return text.trim();
}

export async function pasteText(text?: string) {
  if (text) {
    await clipboardy.write(text);
  }

  await keyboard.pressKey(Key.LeftControl, Key.V);
  // Wait for input to update
  await new Promise((resolve) => setTimeout(resolve, 50));
  await keyboard.releaseKey(Key.V, Key.LeftControl);
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
