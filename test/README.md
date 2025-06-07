# Tests for Node Layout Switcher

This folder contains test files to verify the application functionality.

## Test Descriptions

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

### `test-integration.js`
Integration test of core functionality:
- Tests dictionary loading through main application functions
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
