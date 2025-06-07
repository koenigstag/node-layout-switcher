import clipboardy from 'clipboardy';
import { keyboard, Key } from '@nut-tree-fork/nut-js';
import { Dict, Lang, NewLayoutDict } from './types';
import config, { configDirectory } from './config';
import { selectedLayoutsList } from './constants';
import fs from 'fs';
import path from 'path';

export function buildCharToKey(layout: NewLayoutDict) {
  const map: Record<string, { row: string; index: number; shifted: boolean }> = {};
  
  // Mapping for number row
  layout.numberRow.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'number', index, shifted: false };
  });
  layout.numberRowShifted.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'number', index, shifted: true };
  });
  
  // Mapping for top row
  layout.topRow.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'top', index, shifted: false };
  });
  layout.topRowShifted.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'top', index, shifted: true };
  });
  
  // Mapping for middle row
  layout.middleRow.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'middle', index, shifted: false };
  });
  layout.middleRowShifted.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'middle', index, shifted: true };
  });
  
  // Mapping for bottom row
  layout.bottomRow.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'bottom', index, shifted: false };
  });
  layout.bottomRowShifted.forEach((char: string, index: number) => {
    if (char) map[char] = { row: 'bottom', index, shifted: true };
  });
  
  return map;
}

export async function getDictionary(lang: Lang): Promise<NewLayoutDict> {
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

  const dict: NewLayoutDict = JSON.parse(json);

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
  fromLayout: NewLayoutDict,
  toLayout: NewLayoutDict,
  fromCharToKey: Record<string, { row: string; index: number; shifted: boolean }>
) {
  return [...text]
    .map((ch) => {
      const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
      const lowerChar = ch.toLowerCase();
      
      // Find character in source layout
      const charInfo = fromCharToKey[lowerChar] || fromCharToKey[ch];
      if (!charInfo) return ch;

      // Get character from target layout at the same position
      let mapped: string;
      const { row, index, shifted } = charInfo;
      
      // Determine if we need shifted version based on original case or if it was already shifted
      const needShifted = isUpper || shifted;
      
      switch (row) {
        case 'number':
          mapped = needShifted ? toLayout.numberRowShifted[index] : toLayout.numberRow[index];
          break;
        case 'top':
          mapped = needShifted ? toLayout.topRowShifted[index] : toLayout.topRow[index];
          break;
        case 'middle':
          mapped = needShifted ? toLayout.middleRowShifted[index] : toLayout.middleRow[index];
          break;
        case 'bottom':
          mapped = needShifted ? toLayout.bottomRowShifted[index] : toLayout.bottomRow[index];
          break;
        default:
          return ch;
      }
      
      return mapped || ch;
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
