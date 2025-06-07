const { buildCharToKey, remapText, getDictionary } = require('../dist/utils');

async function testAltCombinations() {
  console.log('🧪 Testing Alt combinations for all supported languages...');
  console.log('ℹ️  Note: Alt combinations work one-way (Alt chars → base chars) to prevent unwanted substitutions\n');

  let allTestsPassed = true;

  try {
    const dictionaries = {};
    const charToKeyMaps = {};
    const languages = ['uk', 'en', 'ru', 'de', 'fr', 'pl', 'cz'];

    // Load all dictionaries
    console.log('📚 Loading dictionaries...');
    for (const lang of languages) {
      dictionaries[lang] = await getDictionary(lang);
      charToKeyMaps[lang] = buildCharToKey(dictionaries[lang]);
    }
    console.log('✅ All dictionaries loaded successfully\n');

    // Test Ukrainian Alt combinations
    console.log('🇺🇦 Testing Ukrainian Alt combinations (ґ):');
    const ukrainianPassed = await testUkrainianWords(dictionaries, charToKeyMaps);
    allTestsPassed = allTestsPassed && ukrainianPassed;

    // Test German Alt combinations
    console.log('\n🇩🇪 Testing German Alt combinations (ß, €):');
    const germanPassed = await testGermanWords(dictionaries, charToKeyMaps);
    allTestsPassed = allTestsPassed && germanPassed;

    // Test Polish Alt combinations
    console.log('\n🇵🇱 Testing Polish Alt combinations (ą, ć, ę, ł, ń, ó, ś, ź, ż):');
    const polishPassed = await testPolishWords(dictionaries, charToKeyMaps);
    allTestsPassed = allTestsPassed && polishPassed;

    // Test French Alt combinations
    console.log('\n🇫🇷 Testing French Alt combinations (à, è, ù, î, ô, ç):');
    const frenchPassed = await testFrenchWords(dictionaries, charToKeyMaps);
    allTestsPassed = allTestsPassed && frenchPassed;

    // Test Czech Alt combinations
    console.log('\n🇨🇿 Testing Czech Alt combinations (á, é, í, ó, ú, č, ď, ň, ř, š, ť, ž):');
    const czechPassed = await testCzechWords(dictionaries, charToKeyMaps);
    allTestsPassed = allTestsPassed && czechPassed;    // Test Russian Alt combinations
    console.log('\n🇷🇺 Testing Russian layout (no Alt combinations):');
    const russianPassed = await testRussianWords(dictionaries, charToKeyMaps);
    allTestsPassed = allTestsPassed && russianPassed;

    if (allTestsPassed) {
      console.log('\n✅ All Alt combination tests passed!');
      console.log('💡 Alt combinations successfully convert special characters to their base equivalents');
      console.log('   This enables proper cross-language text conversion while maintaining predictable behavior');
      process.exit(0);
    } else {
      console.log('\n❌ Some Alt combination tests failed!');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

async function testUkrainianWords(dictionaries, charToKeyMaps) {
  const testCases = [
    // Test Alt combination conversion: ґ → u  
    { input: 'ґ', expected: 'u' },              // ґ → u (Alt combination)
    { input: 'Ґ', expected: 'U' },              // Ґ → U (Alt combination)
    { input: 'test ґ', expected: 'test u' },    // ґ → u in mixed text
    
    // For Ukrainian text with regular Cyrillic letters, we should convert 
    // to Russian layout first, then to English, since Ukrainian layout
    // shares Cyrillic positions with Russian
    { input: 'анок', russianToEn: 'fyjr' },     // Test regular Cyrillic conversion
  ];

  console.log('📝 Testing Ukrainian Alt combinations:');
  let allPassed = true;

  testCases.forEach(({ input, expected, russianToEn }) => {
    const result = remapText(input, dictionaries.uk, dictionaries.en, charToKeyMaps.uk);
    
    if (expected) {
      const passed = result === expected;
      console.log(`  "${input}" → "${result}" ${passed ? '✅' : '❌'}`);
      if (!passed) {
        console.log(`    Expected: "${expected}"`);
        allPassed = false;
      }
    } else if (russianToEn) {
      // For comparison: show what Russian→English conversion gives
      const russianResult = remapText(input, dictionaries.ru, dictionaries.en, charToKeyMaps.ru);
      const passed = result === russianResult;
      console.log(`  "${input}" (uk→en): "${result}" vs (ru→en): "${russianResult}" ${passed ? '✅' : '❌'}`);
      if (!passed) {
        console.log(`    Note: Ukrainian and Russian Cyrillic should convert the same way`);
        allPassed = false;
      }
    }
  });

  // Test that a word with Alt combination works correctly
  const mixedResult = remapText('ґанок', dictionaries.uk, dictionaries.en, charToKeyMaps.uk);
  // ґ should become 'u', анок should follow Cyrillic conversion like Russian
  const expectedMixed = 'u' + remapText('анок', dictionaries.ru, dictionaries.en, charToKeyMaps.ru);
  const mixedPassed = mixedResult === expectedMixed;
  console.log(`  Mixed test: "ґанок" → "${mixedResult}" ${mixedPassed ? '✅' : '❌'}`);
  if (!mixedPassed) {
    console.log(`    Expected: "${expectedMixed}" (ґ→u + Cyrillic conversion)`);
    allPassed = false;
  }

  return allPassed;
}

async function testGermanWords(dictionaries, charToKeyMaps) {
  const testCases = [
    { input: 'Straße', expected: 'Strase' },    // ß → s
    { input: 'weiß', expected: 'weis' },        // ß → s
    { input: '10€', expected: '10e' },          // € → e
    { input: 'Fußball', expected: 'Fusball' },  // ß → s
  ];

  console.log('📝 Testing German Alt combinations:');
  let allPassed = true;

  testCases.forEach(({ input, expected }) => {
    const result = remapText(input, dictionaries.de, dictionaries.en, charToKeyMaps.de);
    const passed = result === expected;
    console.log(`  "${input}" → "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`    Expected: "${expected}"`);
      allPassed = false;
    }
  });

  return allPassed;
}

async function testPolishWords(dictionaries, charToKeyMaps) {
  const testCases = [
    { input: 'łódź', expected: 'lodz' },        // ł → l, ó → o, ź → z
    { input: 'żółć', expected: 'xolc' },        // ż → x (not z!), ó → o, ć → c
    { input: 'ćma', expected: 'cma' },          // ć → c
    { input: 'święta', expected: 'swieta' },    // ś → s, ę → e
  ];

  console.log('📝 Testing Polish Alt combinations:');
  let allPassed = true;

  testCases.forEach(({ input, expected }) => {
    const result = remapText(input, dictionaries.pl, dictionaries.en, charToKeyMaps.pl);
    const passed = result === expected;
    console.log(`  "${input}" → "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`    Expected: "${expected}"`);
      allPassed = false;
    }
  });

  return allPassed;
}

async function testFrenchWords(dictionaries, charToKeyMaps) {
  const testCases = [
    { input: 'français', expected: 'frqncqis' }, // Direct AZERTY conversion (ç → c via Alt)
    { input: 'château', expected: 'châtequ' },   // â stays unchanged, not in Alt combinations
    { input: 'être', expected: 'être' },         // ê stays unchanged, not in Alt combinations
    { input: 'où', expected: 'ou' },             // ù → u (Alt combination)
    { input: 'ç', expected: 'c' },               // ç → c (Alt combination)
    { input: 'à', expected: 'a' },               // à → a (Alt combination)
    { input: 'è', expected: 'e' },               // è → e (Alt combination)
    { input: 'île', expected: 'ile' },           // î → i (Alt combination)
    { input: 'hôtel', expected: 'hotel' },       // ô → o (Alt combination)
  ];

  console.log('📝 Testing French Alt combinations:');
  let allPassed = true;

  testCases.forEach(({ input, expected }) => {
    const result = remapText(input, dictionaries.fr, dictionaries.en, charToKeyMaps.fr);
    const passed = result === expected;
    console.log(`  "${input}" → "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`    Expected: "${expected}"`);
      allPassed = false;
    }
  });

  return allPassed;
}

async function testCzechWords(dictionaries, charToKeyMaps) {
  const testCases = [
    { input: 'český', expected: 'cesk6' },       // č → c (Alt), ý → 6 (number row position)
    { input: 'přítel', expected: 'pritel' },     // ř → r (Alt), í → i (Alt)
    { input: 'děkuji', expected: 'd1kuji' },     // ě → 1 (number row position)
    { input: 'žlutý', expected: 'zlut6' },       // ž → z (Alt), ý → 6 (number row position)
  ];

  console.log('📝 Testing Czech Alt combinations:');
  let allPassed = true;

  testCases.forEach(({ input, expected }) => {
    const result = remapText(input, dictionaries.cz, dictionaries.en, charToKeyMaps.cz);
    const passed = result === expected;
    console.log(`  "${input}" → "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`    Expected: "${expected}"`);
      allPassed = false;
    }
  });

  return allPassed;
}

async function testRussianWords(dictionaries, charToKeyMaps) {
  const testCases = [
    // Test regular Russian text conversion
    { input: 'привет', expected: 'ghbdtn' },     // Regular Cyrillic conversion
    { input: 'ёлка', expected: '`krf' },         // ё is on tilde position in Russian layout
    { input: 'мир', expected: 'vbh' },           // Another regular conversion
  ];

  console.log('📝 Testing Russian layout (no Alt combinations):');
  let allPassed = true;

  testCases.forEach(({ input, expected }) => {
    const result = remapText(input, dictionaries.ru, dictionaries.en, charToKeyMaps.ru);
    const passed = result === expected;
    console.log(`  "${input}" → "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`    Expected: "${expected}"`);
      allPassed = false;
    }
  });

  return allPassed;
}

testAltCombinations().catch(console.error);
