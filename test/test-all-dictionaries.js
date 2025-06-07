// Comprehensive test for all dictionary formats and conversions
const fs = require('fs');
const path = require('path');

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

// Validate dictionary structure
function validateDictionary(name, dict) {
  const required = [
    'numberRow',
    'numberRowShifted',
    'topRow',
    'topRowShifted',
    'middleRow',
    'middleRowShifted',
    'bottomRow',
    'bottomRowShifted',
    'keyMapping',
  ];
  const missing = required.filter((key) => !dict[key]);

  if (missing.length > 0) {
    console.log(`❌ ${name}: Missing keys: ${missing.join(', ')}`);
    return false;
  }

  // Check if all rows have content
  const rows = ['numberRow', 'topRow', 'middleRow', 'bottomRow'];
  for (const row of rows) {
    if (!Array.isArray(dict[row]) || dict[row].length === 0) {
      console.log(`❌ ${name}: ${row} is not a valid array`);
      return false;
    }
    if (
      !Array.isArray(dict[row + 'Shifted']) ||
      dict[row + 'Shifted'].length === 0
    ) {
      console.log(`❌ ${name}: ${row}Shifted is not a valid array`);
      return false;
    }
  }

  console.log(`✅ ${name}: Structure valid`);
  return true;
}

console.log('🔍 Validating dictionary structures...\n');

// Validate all dictionaries
let allValid = true;
for (const [name, dict] of Object.entries(dictionaries)) {
  if (!validateDictionary(name, dict)) {
    allValid = false;
  }
}

if (!allValid) {
  console.log('\n❌ Some dictionaries have invalid structure. Stopping tests.');
  process.exit(1);
}

console.log('\n✅ All dictionaries have valid structure!\n');
