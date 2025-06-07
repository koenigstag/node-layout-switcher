# Contributing to Node Layout Switcher

Thank you for your interest in contributing to Node Layout Switcher! This document provides guidelines and instructions for contributing to this open-source keyboard layout switching utility.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/node-layout-switcher.git
   cd node-layout-switcher
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
5. **Build and test**:
   ```bash
   npm run build
   npm run test:full
   ```

For detailed development setup, see [Development Guide](docs/DEVELOPMENT.md).

## 🤝 How to Contribute

### 🐛 Bug Reports

When reporting bugs, please include:

- **Operating system** and version
- **Node.js version** (`node --version`)
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Error messages** or logs if available
- **Screenshots** if relevant

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) when creating issues.

### 💡 Feature Requests

For new features:

- **Check existing issues** to avoid duplicates
- **Describe the problem** your feature would solve
- **Provide examples** of how it would be used
- **Consider implementation complexity** and compatibility

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

### 🌍 Adding New Languages

To add support for a new language/layout:

1. **Create dictionary file** in `assets/dictionaries/`:
   ```json
   {
     "numberRow": ["characters", "for", "number", "row"],
     "topRow": ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
     "middleRow": ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
     "bottomRow": ["z", "x", "c", "v", "b", "n", "m"],
     "altCombinations": {
       "u": "special_char"
     }
   }
   ```

2. **Update config.json** with language regex:
   ```json
   {
     "langRegexps": {
       "your_lang": "[your-character-range]"
     },
     "dictionaryPaths": {
       "your_lang": "./dictionaries/your_lang.layout.json"
     }
   }
   ```

3. **Add tests** in `test/` directory
4. **Update documentation** with language support

### 🔧 Code Contributions

#### Development Workflow

1. **Make your changes** following our coding standards
2. **Run quality checks**:
   ```bash
   npm run check      # Lint + format + build
   npm run test:full  # Run all tests
   ```
3. **Commit with conventional format**:
   ```bash
   git commit -m "feat: add support for new language"
   ```
4. **Push and create Pull Request**

#### Code Standards

- **TypeScript**: Use strict typing, interfaces, and proper error handling
- **ESLint**: Follow project linting rules (`npm run lint`)
- **Prettier**: Use consistent formatting (`npm run format`)
- **Testing**: Write tests for new features (`npm test`)
- **Documentation**: Update README and docs for user-facing changes

## 📋 Pull Request Process

### Before Submitting

- [ ] **Tests pass**: `npm run test:full`
- [ ] **Quality checks pass**: `npm run check`
- [ ] **Documentation updated** if needed
- [ ] **Conventional commit messages** used
- [ ] **No merge conflicts** with main branch

### PR Requirements

1. **Clear description** of changes and motivation
2. **Link to related issues** if applicable
3. **Screenshots/demos** for UI changes
4. **Breaking changes** clearly documented
5. **Test coverage** for new functionality

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Testing** on different platforms if needed
4. **Documentation review** for accuracy
5. **Merge** after approval

## 💬 Communication

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive in all interactions.

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: Contact maintainers for sensitive issues

## 🏗️ Project Structure

Understanding the codebase:

```
src/
├── index.ts          # Application entry point
├── config.ts         # Configuration management
├── keyboard.ts       # Global hotkey handling
├── actions.ts        # Text conversion actions
├── utils.ts          # Core conversion utilities
└── types.ts          # TypeScript definitions

assets/
├── config.json       # Runtime configuration
└── dictionaries/     # Language layout definitions

test/                 # Test suites
docs/                 # Documentation
scripts/              # Build and automation scripts
```

## 🧪 Testing Guidelines

### Test Categories

- **Unit tests**: Individual function testing
- **Integration tests**: Component interaction testing
- **Real-world tests**: Practical scenario validation
- **Performance tests**: Speed and memory benchmarks

### Writing Tests

```javascript
const { getDictionary, remapText } = require('../dist/utils');

async function testNewFeature() {
  console.log('🧪 Testing new feature...');
  
  try {
    // Test setup
    const dict = await getDictionary('en');
    
    // Test execution
    const result = remapText('test', dict, dict, {});
    
    // Assertions
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
```

## 📝 Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Adding New Languages

To add support for a new language:

1. Create a new dictionary file in `assets/dictionaries/`
2. Update `assets/config.json` with the new language
3. Add tests for the new language
4. Update the README documentation

## Testing

- All code changes should include appropriate tests
- Run `npm run test:full` to run all tests
- Ensure all existing tests still pass

## Pull Request Process

1. Ensure all tests pass and code quality checks succeed
2. Update documentation if needed
3. Fill out the Pull Request template completely
4. Wait for review and address any feedback

## Issues

When reporting issues:
- Use the appropriate issue template
- Provide clear reproduction steps
- Include your environment details
- Share relevant configuration files (without sensitive data)

## Questions?

Feel free to open an issue with the "question" label if you need help!
