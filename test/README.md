# Tests for Node Layout Switcher

This folder contains test files to verify the application functionality.

## Main Test File

### `test/test-comprehensive.js`
**Primary comprehensive test suite** covering all functionality:
- ✅ Basic character mapping for all languages
- ✅ Alt combinations for Ukrainian (ґ), German (ß, €), Polish (ą, ć, ł, etc.), French (à, ç, etc.), Czech (á, č, ř, etc.)
- ✅ English ↔ Ukrainian conversion
- ✅ Layout detection for multiple languages
- ✅ Case sensitivity handling
- ✅ Mixed content with punctuation
- ✅ Alt combination edge cases
- ✅ Round-trip conversion testing
- ✅ Dictionary structure validation
- ✅ Performance testing

**Usage:** `node test/test-comprehensive.js`

## Legacy Test Descriptions

### `test-conversion.js`
Quick test of basic text conversion functionality:
- Tests conversion between English and Russian languages
- Verifies conversion reversibility
- Tests various cases (lowercase, uppercase, mixed)
- Tests conversion between different language pairs

### `test-all-dictionaries.js`
Comprehensive test of all dictionaries:
- Validates structure of all dictionaries
- Verifies correctness of dictionary format (arrays instead of objects)
- **Note:** Partially covered by comprehensive test

### `test-integration.js`
Integration test of core functionality:
- Tests dictionary loading through main application functions
- **Note:** Covered by comprehensive test

### `test-ukrainian-real-world.js`
Real-world Ukrainian text testing:
- Tests actual Ukrainian words and phrases
- **Note:** Extended functionality in comprehensive test

## Recommended Testing Approach

1. **Primary:** Run `node test-comprehensive.js` from root folder
2. **Legacy:** Individual tests in this folder for specific edge cases
3. **Development:** Use comprehensive test for regression testing

## Alt Combinations Added

The comprehensive test now validates Alt combinations for:
- 🇺🇦 **Ukrainian:** `u→ґ`, `U→Ґ`
- 🇩🇪 **German:** `s→ß`, `e→€`
- 🇵🇱 **Polish:** `a→ą`, `c→ć`, `e→ę`, `l→ł`, `n→ń`, `o→ó`, `s→ś`, `z→ź`, `x→ż` (with uppercase variants)
- 🇫🇷 **French:** `a→à`, `e→è`, `u→ù`, `i→î`, `o→ô`, `c→ç`
- 🇨🇿 **Czech:** `a→á`, `e→é`, `i→í`, `o→ó`, `u→ú`, `c→č`, `d→ď`, `n→ň`, `r→ř`, `s→š`, `t→ť`, `z→ž` (with uppercase variants)
- 🇷🇺 **Russian:** `e→є`, `i→і` (with uppercase variants)
- Verifies automatic language detection
- Tests character mapping creation and text conversion

## Running Tests

```bash
# Run all tests
npm test

# Run quick conversion test
npm run test:quick

# Run conversion test
npm run test:conversion

# Run all dictionaries test
npm run test:dictionaries

# Run integration test
npm run test:integration
```

## Supported Languages

Tests verify functionality with the following languages:
- English (QWERTY, DVORAK)
- Russian (QWERTY)
- Ukrainian (QWERTY)
- German (QWERTZ)
- French (AZERTY)
- Czech (QWERTZ)
- Polish (QWERTY)
