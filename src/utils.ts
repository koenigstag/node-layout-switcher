import { CharMap, Lang, NewLayoutDict } from './types';
import config, { configDirectory } from './config';
import { selectedLayoutsList } from './constants';
import fs from 'fs';
import path from 'path';
import enQwertyLayout from '../assets/dictionaries/en.qwerty.json';

// Conditionally import nut-js only in non-pkg environment
let keyboard: any;
let Key: any;

const isPkg = !!process.pkg;

if (!isPkg) {
  try {
    const nutjs = require('@nut-tree-fork/nut-js');
    keyboard = nutjs.keyboard;
    Key = nutjs.Key;
  } catch {
    console.warn('⚠️  nut-js not available, some features may be limited');
  }
}

// Dynamic import clipboardy (ES module) for Node v18.x compatibility
async function getClipboardy() {
  const clipboardy = await import('clipboardy');
  return clipboardy.default;
}

// PowerShell clipboard functions for pkg builds
async function readClipboardPowerShell(): Promise<string> {
  if (process.platform !== 'win32') {
    return '';
  }

  const { spawn } = await import('child_process');

  return new Promise((resolve, reject) => {
    const ps = spawn('powershell', ['-Command', 'Get-Clipboard'], {
      windowsHide: true,
    });

    let output = '';

    ps.stdout.on('data', data => {
      output += data.toString();
    });

    ps.on('close', code => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`PowerShell exited with code ${code}`));
      }
    });

    ps.on('error', reject);
  });
}

async function writeClipboardPowerShell(text: string): Promise<void> {
  if (process.platform !== 'win32') {
    return;
  }

  const { spawn } = await import('child_process');

  return new Promise((resolve, reject) => {
    const ps = spawn(
      'powershell',
      ['-Command', `Set-Clipboard -Value "${text.replace(/"/g, '""')}"`],
      { windowsHide: true },
    );

    ps.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`PowerShell exited with code ${code}`));
      }
    });

    ps.on('error', reject);
  });
}

export function buildCharToKey(layout: NewLayoutDict, disableAlt?: boolean) {
  const map: CharMap = {};

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

  // Mapping for Alt combinations (special case)
  if (layout.altCombinations && !disableAlt) {
    // Build mapping for English QWERTY layout (reuse the same logic)
    const qwertyCharToKey = buildCharToKey(enQwertyLayout, true);

    Object.entries(layout.altCombinations).forEach(([baseChar, altChar]) => {
      // Find position of baseChar in English QWERTY layout
      const keyPosition = qwertyCharToKey[baseChar];

      if (keyPosition) {
        map[altChar] = { ...keyPosition, altCombination: true };
      }
    });
  }

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
      `Dictionary file not found for language: ${lang}. Path: ${filePath}`,
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
  // Define deterministic language priority order
  // More specific languages (with unique characters) should come first
  // to avoid false matches with more generic patterns
  const languagePriority: Lang[] = [
    'uk', // Ukrainian (has unique characters: і, ї, є, ґ)
    'ru', // Russian (has unique character: ё)
    'cz', // Czech (has many unique diacritics)
    'pl', // Polish (has unique characters with diacritics)
    'fr', // French (has unique diacritics)
    'de', // German (has unique characters: ä, ö, ü, ß)
    'en', // English (most generic, should be last)
  ];

  const regexpsForLangs: Record<Lang, RegExp> = selectedLayoutsList.reduce(
    (acc, lang) => {
      acc[lang] = new RegExp(config.langRegexps[lang], 'i');
      return acc;
    },
    {} as Record<Lang, RegExp>,
  );

  // Check languages in deterministic priority order
  for (const lang of languagePriority) {
    // Only check if this language is in selectedLayoutsList
    if (selectedLayoutsList.includes(lang) && regexpsForLangs[lang]) {
      if (regexpsForLangs[lang].test(text)) {
        return lang;
      }
    }
  }

  return undefined;
}

export function remapText(
  text: string,
  fromLayout: NewLayoutDict,
  toLayout: NewLayoutDict,
  fromCharToKey: CharMap,
) {
  return [...text]
    .map(ch => {
      const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
      const lowerChar = ch.toLowerCase();

      // Find character in source layout
      const charInfo = fromCharToKey[lowerChar] || fromCharToKey[ch];
      if (!charInfo) return ch;

      // Handle Alt combinations - if source character is an Alt combination,
      // try to find the equivalent Alt combination in target layout
      if (charInfo.altCombination) {
        if (toLayout.altCombinations) {
          // Find which base character this alt char corresponds to in source
          const sourceAltEntry = Object.entries(
            fromLayout.altCombinations || {},
          ).find(([, altChar]) => altChar === ch || altChar === lowerChar);

          if (sourceAltEntry) {
            const [sourceBaseChar] = sourceAltEntry;
            // Check if target layout has alt combination for the same base char
            const targetAltChar = toLayout.altCombinations[sourceBaseChar];
            if (targetAltChar) {
              return isUpper ? targetAltChar.toUpperCase() : targetAltChar;
            }
          }
        }
        // If no alt combination found in target, fall back to regular mapping
      }

      // Get character from target layout at the same position
      let mapped: string;
      const { row, index, shifted } = charInfo;

      // Determine if we need shifted version based on original case or if it was already shifted
      const needShifted = isUpper || shifted;

      switch (row) {
        case 'number':
          mapped = needShifted
            ? toLayout.numberRowShifted[index]
            : toLayout.numberRow[index];
          break;
        case 'top':
          mapped = needShifted
            ? toLayout.topRowShifted[index]
            : toLayout.topRow[index];
          break;
        case 'middle':
          mapped = needShifted
            ? toLayout.middleRowShifted[index]
            : toLayout.middleRow[index];
          break;
        case 'bottom':
          mapped = needShifted
            ? toLayout.bottomRowShifted[index]
            : toLayout.bottomRow[index];
          break;
        default:
          return ch;
      }

      // Alt combinations are only used for direct conversion (e.g., ґ → u)
      // We don't automatically convert back (u → ґ) to avoid unwanted substitutions
      // This makes the behavior predictable: Alt chars go to their base positions,
      // but base positions don't automatically become Alt chars

      return mapped || ch;
    })
    .join('');
}

export async function copyText(): Promise<string> {
  if (!keyboard || !Key) {
    // In pkg build, use PowerShell to simulate Ctrl+C and read clipboard
    if (process.platform === 'win32') {
      const { spawn } = await import('child_process');

      console.log('📋 Simulating Ctrl+C using Powershell...');

      try {
        // Simulate Ctrl+C
        await new Promise<void>((resolve, reject) => {
          const ps = spawn(
            'powershell',
            [
              '-Command',
              'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("^c")',
            ],
            { windowsHide: true },
          );

          ps.on('close', code => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`PowerShell exited with code ${code}`));
            }
          });

          ps.on('error', reject);
        });

        // Wait for clipboard to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('⚠️  Failed to simulate Ctrl+C:', error);
        return '';
      }

      try {
        // Read clipboard using PowerShell
        const text = await readClipboardPowerShell();
        return text.trim();
      } catch (error) {
        console.warn('⚠️  Failed to read clipboard:', error);
        return '';
      }
    } else {
      console.warn(
        '⚠️  Keyboard automation not available in pkg build for this platform',
      );
      return '';
    }
  } else {
    await keyboard.pressKey(Key.LeftControl, Key.C);
    // Wait for clipboard to update
    await new Promise(resolve => setTimeout(resolve, 50));
    await keyboard.releaseKey(Key.C, Key.LeftControl);

    const clipboardy = await getClipboardy();
    const text = await clipboardy.read();

    return text.trim();
  }
}

export async function pasteText(text?: string) {
  if (!keyboard || !Key) {
    // In pkg build, use PowerShell to write clipboard and simulate Ctrl+V
    if (process.platform === 'win32') {
      if (text) {
        try {
          await writeClipboardPowerShell(text);
        } catch (error) {
          console.warn('⚠️  Failed to write to clipboard:', error);
          return;
        }
      }

      const { spawn } = await import('child_process');

      console.log('📋 Simulating Ctrl+V using Powershell...');

      try {
        await new Promise<void>((resolve, reject) => {
          const ps = spawn(
            'powershell',
            [
              '-Command',
              'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("^v")',
            ],
            { windowsHide: true },
          );

          ps.on('close', code => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`PowerShell exited with code ${code}`));
            }
          });

          ps.on('error', reject);
        });

        // Wait for input to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('⚠️  Failed to simulate Ctrl+V:', error);
        if (text) {
          console.log(`Text that should be pasted: ${text}`);
        }
      }
    } else {
      console.warn(
        '⚠️  Keyboard automation not available in pkg build for this platform',
      );
      if (text) {
        console.log(`Text to paste: ${text}`);
      }
    }
    return;
  }

  if (text) {
    const clipboardy = await getClipboardy();
    await clipboardy.write(text);
  }

  await keyboard.pressKey(Key.LeftControl, Key.V);
  // Wait for input to update
  await new Promise(resolve => setTimeout(resolve, 50));
  await keyboard.releaseKey(Key.V, Key.LeftControl);
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
