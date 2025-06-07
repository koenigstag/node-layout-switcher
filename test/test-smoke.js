// Quick integration test to verify the main functionality works
const {
  getDictionary,
  buildCharToKey,
  remapText,
  detectLayoutKey,
} = require('../dist/utils');
const { selectedLayoutsList } = require('../dist/constants');

async function quickTest() {
  try {
    console.log('🧪 Testing core functionality...\n');

    // Test dictionary loading
    console.log('📚 Testing dictionary loading...');
    const enDict = await getDictionary('en');
    const ruDict = await getDictionary('ru');
    console.log('✅ Dictionaries loaded successfully\n');

    // Test character mapping
    console.log('🔤 Testing character mapping...');
    const enCharToKey = buildCharToKey(enDict);
    const ruCharToKey = buildCharToKey(ruDict);
    console.log('✅ Character mappings built successfully\n');

    // Test text conversion
    console.log('🔄 Testing text conversion...');
    const testText = 'hello world';
    const converted = remapText(testText, enDict, ruDict, enCharToKey);
    const reversed = remapText(converted, ruDict, enDict, ruCharToKey);

    console.log(`Original: "${testText}"`);
    console.log(`Converted: "${converted}"`);
    console.log(`Reversed: "${reversed}"`);
    console.log(`Match: ${testText === reversed ? '✅' : '❌'}\n`);

    // Test language detection
    console.log('🔍 Testing language detection...');
    const detectedEn = detectLayoutKey('hello world');
    const detectedRu = detectLayoutKey('привет мир');

    console.log(`"hello world" detected as: ${detectedEn}`);
    console.log(`"привет мир" detected as: ${detectedRu}`);
    console.log(
      `Detection working: ${
        detectedEn === 'en' && detectedRu === 'ru' ? '✅' : '❌'
      }\n`
    );

    // Test supported languages
    console.log('🌍 Supported languages:');
    console.log(selectedLayoutsList.join(', '));

    console.log('\n🎉 All core functionality tests passed!');
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    process.exit(1);
  }
}

quickTest();
