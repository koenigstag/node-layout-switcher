#!/usr/bin/env node

/**
 * Comprehensive test suite for keyboard layout switcher
 * Tests basic conversions, Alt combinations, and edge cases for all supported languages
 */

const { getDictionary, buildCharToKey, remapText, detectLayoutKey } = require('../dist/utils');

async function runComprehensiveTests() {
  console.log('🧪 Running comprehensive keyboard layout switcher tests...\n');

  const results = {
    passed: 0,
    failed: 0,
    details: []
  };

  function test(name, condition, details = '') {
    if (condition) {
      console.log(`✅ ${name}`);
      results.passed++;
    } else {
      console.log(`❌ ${name}${details ? ': ' + details : ''}`);
      results.failed++;
    }
    results.details.push({ name, passed: condition, details });
  }

  try {
    // Load all dictionaries
    console.log('📚 Loading dictionaries...');
    const dictionaries = {};
    const languages = ['en', 'uk', 'ru', 'de', 'fr', 'pl', 'cz'];

    for (const lang of languages) {
      dictionaries[lang] = await getDictionary(lang);
    }
    console.log('✅ All dictionaries loaded successfully\n');

    // Test 1: Basic character mapping functionality
    console.log('🔤 Testing basic character mapping...');
    const enCharToKey = buildCharToKey(dictionaries.en);
    const ukCharToKey = buildCharToKey(dictionaries.uk);

    test('English u maps correctly', enCharToKey['u']?.row === 'top' && enCharToKey['u']?.index === 6);
    test('Ukrainian у maps correctly', ukCharToKey['у']?.row === 'top' && ukCharToKey['у']?.index === 2);
    test('Ukrainian ґ Alt combination works', ukCharToKey['ґ']?.altCombination === true);

    // Test 2: Alt combinations for all languages
    console.log('\n🎯 Testing Alt combinations...');

    // Ukrainian
    const ukText = 'ґанок';
    const ukToEn = remapText(ukText, dictionaries.uk, dictionaries.en, ukCharToKey);
    test('Ukrainian ґ → English u', ukToEn === 'ufyjr');

    // German
    const deCharToKey = buildCharToKey(dictionaries.de);
    test('German ß Alt combination exists', deCharToKey['ß']?.altCombination === true);
    test('German € Alt combination exists', deCharToKey['€']?.altCombination === true);

    // Polish
    const plCharToKey = buildCharToKey(dictionaries.pl);
    test('Polish ą Alt combination exists', plCharToKey['ą']?.altCombination === true);
    test('Polish ć Alt combination exists', plCharToKey['ć']?.altCombination === true);
    test('Polish ł Alt combination exists', plCharToKey['ł']?.altCombination === true);

    // French
    const frCharToKey = buildCharToKey(dictionaries.fr);
    test('French à Alt combination exists', frCharToKey['à']?.altCombination === true);
    test('French ç Alt combination exists', frCharToKey['ç']?.altCombination === true);

    // Czech
    const czCharToKey = buildCharToKey(dictionaries.cz);
    test('Czech á Alt combination exists', czCharToKey['á']?.altCombination === true);
    test('Czech č Alt combination exists', czCharToKey['č']?.altCombination === true);
    test('Czech ř Alt combination exists', czCharToKey['ř']?.altCombination === true);

    // Test 3: Basic English ↔ Ukrainian conversion
    console.log('\n🔄 Testing English ↔ Ukrainian conversion...');

    const testWords = [
      { en: 'hello', uk: 'руддщ' },
      { en: 'world', uk: 'цщкдв' },
      { en: 'test', uk: 'еуіе' },  // Fixed: t→т, e→у, s→і, t→т
      { en: 'keyboard', uk: 'лунищфкв' }  // Fixed: k→л, e→у, y→н, b→и, o→щ, a→ф, r→к, d→в
    ];

    testWords.forEach(({ en, uk }) => {
      const enToUk = remapText(en, dictionaries.en, dictionaries.uk, enCharToKey);
      const ukToEn = remapText(uk, dictionaries.uk, dictionaries.en, ukCharToKey);

      test(`"${en}" → "${uk}"`, enToUk === uk, `got "${enToUk}"`);
      test(`"${uk}" → "${en}"`, ukToEn === en, `got "${ukToEn}"`);
    });

    // Test 4: Layout detection
    console.log('\n🔍 Testing layout detection...');

    test('Detects English text', detectLayoutKey('hello world') === 'en');
    // Note: Ukrainian detection requires uk to be in selectedTuple in config.json
    // For now testing with available languages only
    test('Detects Russian text (fallback)', detectLayoutKey('привет мир') === 'ru');

    // Test 5: Case sensitivity
    console.log('\n🔠 Testing case sensitivity...');

    const upperCase = remapText('HELLO', dictionaries.en, dictionaries.uk, enCharToKey);
    const lowerCase = remapText('hello', dictionaries.en, dictionaries.uk, enCharToKey);

    test('Uppercase conversion works', upperCase === 'РУДДЩ');
    test('Lowercase conversion works', lowerCase === 'руддщ');

    // Test 6: Mixed case and special characters
    console.log('\n🎨 Testing mixed content...');

    const mixedText = 'Hello, World! 123';
    const mixedConverted = remapText(mixedText, dictionaries.en, dictionaries.uk, enCharToKey);

    test('Mixed case with punctuation', mixedConverted === 'Руддщб Цщкдв! 123');

    // Test 7: Alt combination edge cases
    console.log('\n⚡ Testing Alt combination edge cases...');

    // Test that regular u doesn't become ґ (prevented unwanted conversion)
    const regularU = remapText('u', dictionaries.en, dictionaries.uk, enCharToKey);
    test('Regular u → г (not ґ)', regularU === 'г');

    // Test that ґ → u works
    const altG = remapText('ґ', dictionaries.uk, dictionaries.en, ukCharToKey);
    test('Alt ґ → u', altG === 'u');

    // Test 8: Round-trip conversion with Alt combinations
    console.log('\n🔄 Testing round-trip Alt combinations...');

    const originalWithAlt = 'ґрунт';
    const toEn = remapText(originalWithAlt, dictionaries.uk, dictionaries.en, ukCharToKey);
    const backToUk = remapText(toEn, dictionaries.en, dictionaries.uk, enCharToKey);

    // Note: This should NOT be identical due to prevented auto-conversion
    test('Round-trip ґ conversion (expected difference)', originalWithAlt !== backToUk);
    test('ґрунт → uheyn', toEn === 'uheyn');
    test('uheyn → грунт (not ґрунт)', backToUk === 'грунт');

    // Test 9: Dictionary structure validation
    console.log('\n📋 Testing dictionary structure...');

    languages.forEach(lang => {
      const dict = dictionaries[lang];
      
      // Russian layout intentionally has no Alt combinations (uses only standard Cyrillic)
      if (lang === 'ru') {
        test(`${lang} has no altCombinations (correct architecture)`, !dict.hasOwnProperty('altCombinations') || Object.keys(dict.altCombinations || {}).length === 0);
      } else {
        test(`${lang} has altCombinations field`, dict.hasOwnProperty('altCombinations'));
        test(`${lang} altCombinations is object`, typeof dict.altCombinations === 'object');
      }
    });

    // Test 10: Performance test
    console.log('\n⚡ Testing performance...');

    const startTime = Date.now();
    for (let i = 0; i < 1000; i++) {
      remapText('hello world', dictionaries.en, dictionaries.uk, enCharToKey);
    }
    const endTime = Date.now();
    const duration = endTime - startTime;

    test('Performance test (1000 conversions < 100ms)', duration < 100, `took ${duration}ms`);

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    results.failed++;
    results.details.push({ name: 'Test suite execution', passed: false, details: error.message });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  if (results.passed) {
    console.log(`✅ Passed: ${results.passed}`);
  }
  if (results.failed) {
    console.log(`❌ Failed: ${results.failed}`);
  }
  console.log(`📈 Success rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed tests:');
    results.details
      .filter(r => !r.passed)
      .forEach(r => console.log(`   • ${r.name}${r.details ? ': ' + r.details : ''}`));
  }

  console.log('\n🎉 Comprehensive test suite completed!');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

runComprehensiveTests();
