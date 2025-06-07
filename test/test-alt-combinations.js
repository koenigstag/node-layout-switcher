const { buildCharToKey, remapText, getDictionary } = require('../dist/utils');

async function testAltCombinations() {
  console.log('🧪 Testing Alt combinations for all supported languages...\n');

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
    await testUkrainianWords(dictionaries, charToKeyMaps);

    // Test German Alt combinations  
    console.log('\n🇩🇪 Testing German Alt combinations (ß, €):');
    await testGermanWords(dictionaries, charToKeyMaps);

    // Test Polish Alt combinations
    console.log('\n🇵🇱 Testing Polish Alt combinations (ą, ć, ę, ł, ń, ó, ś, ź, ż):');
    await testPolishWords(dictionaries, charToKeyMaps);

    // Test French Alt combinations
    console.log('\n🇫🇷 Testing French Alt combinations (à, è, ù, î, ô, ç):');
    await testFrenchWords(dictionaries, charToKeyMaps);

    // Test Czech Alt combinations
    console.log('\n🇨🇿 Testing Czech Alt combinations (á, é, í, ó, ú, č, ď, ň, ř, š, ť, ž):');
    await testCzechWords(dictionaries, charToKeyMaps);

    // Test Russian Alt combinations
    console.log('\n🇷🇺 Testing Russian Alt combinations (є, і):');
    await testRussianWords(dictionaries, charToKeyMaps);

    console.log('\n✅ All Alt combination tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

async function testUkrainianWords(dictionaries, charToKeyMaps) {
  const ukrainianWords = [
    'ґанок',        // porch
    'ґудзик',       // button
    'ґрунт',        // soil
    'Ґалаґан',      // surname
    'ґрати',        // grate/bars
    'ґвалт',        // noise/outcry
  ];

  console.log('📝 Testing Ukrainian words with "ґ":');
  ukrainianWords.forEach(word => {
    const toEnglish = remapText(word, dictionaries.uk, dictionaries.en, charToKeyMaps.uk);
    const backToUkrainian = remapText(toEnglish, dictionaries.en, dictionaries.uk, charToKeyMaps.en);
    console.log(`  "${word}" → "${toEnglish}" → "${backToUkrainian}" ${word === backToUkrainian ? '✅' : '❌'}`);
  });
}

async function testGermanWords(dictionaries, charToKeyMaps) {
  const germanWords = [
    'Straße',       // street (with ß)
    'weiß',         // white (with ß)
    '10€',          // 10 euros (with €)
    'Fußball',      // football (with ß)
  ];

  console.log('📝 Testing German words with Alt combinations:');
  germanWords.forEach(word => {
    const toEnglish = remapText(word, dictionaries.de, dictionaries.en, charToKeyMaps.de);
    const backToGerman = remapText(toEnglish, dictionaries.en, dictionaries.de, charToKeyMaps.en);
    console.log(`  "${word}" → "${toEnglish}" → "${backToGerman}"`);
  });
}

async function testPolishWords(dictionaries, charToKeyMaps) {
  const polishWords = [
    'ąćęłńóśźż',    // all special chars
    'łódź',         // boat (city name)
    'żółć',         // bile
    'ćma',          // moth
    'święta',       // holidays
  ];

  console.log('📝 Testing Polish words with Alt combinations:');
  polishWords.forEach(word => {
    const toEnglish = remapText(word, dictionaries.pl, dictionaries.en, charToKeyMaps.pl);
    const backToPolish = remapText(toEnglish, dictionaries.en, dictionaries.pl, charToKeyMaps.en);
    console.log(`  "${word}" → "${toEnglish}" → "${backToPolish}"`);
  });
}

async function testFrenchWords(dictionaries, charToKeyMaps) {
  const frenchWords = [
    'àèùîôç',       // all special chars
    'français',     // French
    'château',      // castle
    'être',         // to be
    'où',           // where
  ];

  console.log('📝 Testing French words with Alt combinations:');
  frenchWords.forEach(word => {
    const toEnglish = remapText(word, dictionaries.fr, dictionaries.en, charToKeyMaps.fr);
    const backToFrench = remapText(toEnglish, dictionaries.en, dictionaries.fr, charToKeyMaps.en);
    console.log(`  "${word}" → "${toEnglish}" → "${backToFrench}"`);
  });
}

async function testCzechWords(dictionaries, charToKeyMaps) {
  const czechWords = [
    'áéíóúčďňřšťž',  // all special chars
    'český',        // Czech
    'přítel',       // friend
    'děkuji',       // thank you
    'žlutý',        // yellow
  ];

  console.log('📝 Testing Czech words with Alt combinations:');
  czechWords.forEach(word => {
    const toEnglish = remapText(word, dictionaries.cz, dictionaries.en, charToKeyMaps.cz);
    const backToCzech = remapText(toEnglish, dictionaries.en, dictionaries.cz, charToKeyMaps.en);
    console.log(`  "${word}" → "${toEnglish}" → "${backToCzech}"`);
  });
}

async function testRussianWords(dictionaries, charToKeyMaps) {
  const russianWords = [
    'єі',           // special chars
    'Євро',         // Euro (with Є)
    'інтернет',     // internet (with і)
  ];

  console.log('📝 Testing Russian words with Alt combinations:');
  russianWords.forEach(word => {
    const toEnglish = remapText(word, dictionaries.ru, dictionaries.en, charToKeyMaps.ru);
    const backToRussian = remapText(toEnglish, dictionaries.en, dictionaries.ru, charToKeyMaps.en);
    console.log(`  "${word}" → "${toEnglish}" → "${backToRussian}"`);
  });
}

testAltCombinations().catch(console.error);
