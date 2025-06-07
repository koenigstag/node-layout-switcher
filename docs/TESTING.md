# Testing

The project includes comprehensive testing to ensure keyboard layout switching works correctly:

## Test Scripts

- `npm test` - Run comprehensive test suite (primary test)
- `npm run test:comprehensive` - Full comprehensive test suite
- `npm run test:conversion` - Basic conversion and reversibility tests
- `npm run test:ukrainian` - Specialized Ukrainian real-world scenarios
- `npm run test:full` - Run all main tests (comprehensive + conversion + Ukrainian)
- `npm run test:dictionaries` - Dictionary validation tests
- `npm run test:integration` - Integration tests

## Test Coverage

### Comprehensive Test (`test-comprehensive.js`)
- ✅ Basic character mapping for all languages
- ✅ Alt combinations functionality
- ✅ English ↔ Ukrainian conversions
- ✅ Layout detection
- ✅ Case sensitivity handling
- ✅ Mixed content with punctuation and numbers
- ✅ Alt combination edge cases
- ✅ Round-trip conversion testing
- ✅ Dictionary structure validation
- ✅ Performance benchmarking (1000 conversions < 100ms)

### Conversion Test (`test-conversion.js`)
- 🔄 **Detailed reversibility testing** for all language pairs
- 🌍 **Multi-language conversions**: EN↔RU, EN↔DE, EN↔FR, EN↔DVORAK
- 📝 **Real-world strings**: "hello world", "привет мир", mixed case and symbols
- 🎯 **Step-by-step conversion validation** with detailed output
- 🔍 **Regression testing** for conversion accuracy

### Ukrainian Real-World Test (`test-ukrainian-real-world.js`)
- 🎯 Real Ukrainian words with "ґ" (ґанок, ґудзик, ґрунт, etc.)
- 🔄 Detailed round-trip testing: Ukrainian → English → Ukrainian
- 🌍 Cross-language testing: Ukrainian → Russian → Ukrainian
- 📝 Mixed Ukrainian text scenarios with "ґ" in context
- 🎯 Specific "ґ" behavior validation in various contexts

## Running Tests

### Quick Test
```bash
npm test
```

### Full Test Suite
```bash
npm run test:full
```

### Specific Tests
```bash
# Test basic conversions and reversibility
npm run test:conversion

# Test Ukrainian real-world scenarios
npm run test:ukrainian

# Test dictionary validation
npm run test:dictionaries

# Test integration
npm run test:integration
```

## Test Development

### Adding New Tests

1. Create test files in the `test/` directory
2. Follow the naming convention: `test-[feature].js`
3. Use the existing test utilities from `../dist/utils`
4. Add your test script to `package.json` scripts section

### Test Structure

Each test file should:
- Import required utilities from `../dist/utils`
- Include descriptive test names and console output
- Provide clear success/failure indicators
- Return appropriate exit codes (0 for success, 1 for failure)

### Example Test Function
```javascript
const { getDictionary, buildCharToKey, remapText } = require('../dist/utils');

async function testExample() {
  console.log('🧪 Testing example functionality...\n');
  
  try {
    const dict = await getDictionary('en');
    const charToKey = buildCharToKey(dict);
    
    // Your test logic here
    const result = remapText('test', dict, dict, charToKey);
    
    if (result === 'expected') {
      console.log('✅ Test passed');
      process.exit(0);
    } else {
      console.log('❌ Test failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
}

testExample();
```

## Continuous Integration

Tests are automatically run in CI/CD pipeline:
- On every pull request
- On main branch pushes
- On release tags

### CI Test Matrix
- Node.js versions: 18, 20, 22
- Operating systems: Ubuntu, Windows, macOS
- Test suites: All comprehensive tests

## Performance Benchmarks

The comprehensive test includes performance benchmarks:
- **Target**: 1000 conversions in < 100ms
- **Typical performance**: ~50-80ms for 1000 conversions
- **Memory usage**: Minimal impact during testing

## Troubleshooting Tests

### Common Test Issues

**Tests fail to import modules:**
```bash
npm run build
```

**Permission errors:**
- Run with appropriate permissions
- Check file system access

**Dictionary loading errors:**
- Verify dictionary files exist in `assets/dictionaries/`
- Check JSON syntax in dictionary files

**Performance test failures:**
- May occur on slower systems
- Adjust threshold in test if needed

### Debug Mode

For detailed test debugging, you can modify test files to include more verbose output or add temporary debugging statements.
