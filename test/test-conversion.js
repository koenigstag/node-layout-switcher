// Simple test to verify the conversion algorithm works
const fs = require('fs');
const path = require('path');

const { buildCharToKey, remapText } = require('../dist/utils');

// Load all dictionaries
const dictionaries = {
  'en.qwerty': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/en.qwerty.json'),
      'utf-8'
    )
  ),
  'en.dvorak': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/en.dvorak.json'),
      'utf-8'
    )
  ),
  'ru.qwerty': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/ru.qwerty.json'),
      'utf-8'
    )
  ),
  'uk.qwerty': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/uk.qwerty.json'),
      'utf-8'
    )
  ),
  'de.qwertz': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/de.qwertz.json'),
      'utf-8'
    )
  ),
  'fr.azerty': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/fr.azerty.json'),
      'utf-8'
    )
  ),
  'cz.qwertz': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/cz.qwertz.json'),
      'utf-8'
    )
  ),
  'pl.qwerty': JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../assets/dictionaries/pl.qwerty.json'),
      'utf-8'
    )
  ),
};

// Test conversion
console.log('🧪 Testing English to Russian conversion...');

const enCharToKey = buildCharToKey(dictionaries['en.qwerty']);
const ruCharToKey = buildCharToKey(dictionaries['ru.qwerty']);

// Simple Test cases
const enToRuTestCases = [
  'hello world',
  'Hello World!',
  'HELLO WORLD',
  'qwerty123',
  'QWERTY!@#',
];

enToRuTestCases.forEach((text) => {
  console.log(`\nOriginal (EN): "${text}"`);

  // EN to RU
  const enToRu = remapText(
    text,
    dictionaries['en.qwerty'],
    dictionaries['ru.qwerty'],
    enCharToKey
  );
  console.log(`EN -> RU:      "${enToRu}"`);

  // RU back to EN
  const ruToEn = remapText(
    enToRu,
    dictionaries['ru.qwerty'],
    dictionaries['en.qwerty'],
    ruCharToKey
  );
  console.log(`RU -> EN:      "${ruToEn}"`);

  // Check if conversion is reversible
  const isReversible = text === ruToEn;
  console.log(`Reversible:    ${isReversible ? '✅' : '❌'}`);
});

console.log('\n🧪 Testing Russian to English conversion...');

const ruToEnTestCases = [
  'привет мир',
  'Привет Мир!',
  'ПРИВЕТ МИР',
  'йцукен123',
];

ruToEnTestCases.forEach((text) => {
  console.log(`\nOriginal (RU): "${text}"`);

  // RU to EN
  const ruToEn = remapText(
    text,
    dictionaries['ru.qwerty'],
    dictionaries['en.qwerty'],
    ruCharToKey
  );
  console.log(`RU -> EN:      "${ruToEn}"`);

  // EN back to RU
  const enToRu = remapText(
    ruToEn,
    dictionaries['en.qwerty'],
    dictionaries['ru.qwerty'],
    enCharToKey
  );
  console.log(`EN -> RU:      "${enToRu}"`);

  // Check if conversion is reversible
  const isReversible = text === enToRu;
  console.log(`Reversible:    ${isReversible ? '✅' : '❌'}`);
});

console.log('\n🧪 Testing conversions between different language pairs...\n');

const testPairs = [
  ['en.qwerty', 'ru.qwerty', 'hello world', 'руддщ цщкдв'],
  ['en.qwerty', 'de.qwertz', 'hello world', 'hello world'], // Should be similar for basic letters
  ['en.qwerty', 'fr.azerty', 'hello world', 'hello world'], // Should be similar for basic letters
  ['ru.qwerty', 'en.qwerty', 'привет', 'ghbdtn'],
  ['en.qwerty', 'en.dvorak', 'qwerty', 'fghijk'], // Different layout test
  // TODO add more pairs as needed
];

for (const [fromLayout, toLayout, input, expected] of testPairs) {
  const fromDict = dictionaries[fromLayout];
  const toDict = dictionaries[toLayout];
  const fromCharToKey = buildCharToKey(fromDict);

  const result = remapText(input, fromDict, toDict, fromCharToKey);

  console.log(`${fromLayout} -> ${toLayout}:`);
  console.log(`  Input: "${input}"`);
  console.log(`  Output: "${result}"`);

  // Test reversibility
  const toCharToKey = buildCharToKey(toDict);
  const reversed = remapText(result, toDict, fromDict, toCharToKey);
  const isReversible = input === reversed;

  console.log(`  Reversed: "${reversed}"`);
  console.log(`  Reversible: ${isReversible ? '✅' : '❌'}`);
  console.log('');
}

console.log('🎉 All tests completed!');
