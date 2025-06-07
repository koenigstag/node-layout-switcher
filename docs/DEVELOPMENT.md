# Development Guide

This guide covers development setup, building, testing, and contributing to the Node Layout Switcher project.

## Getting Started

### Prerequisites

- Node.js 18+
- Windows/macOS/Linux
- Git

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/koenigstag/node-layout-switcher.git
   cd node-layout-switcher
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm run test:full
   ```

For detailed testing information, see [Testing Documentation](TESTING.md).

## Project Structure

```
├── src/
│   ├── index.ts          # Main entry point
│   ├── config.ts         # Configuration management
│   ├── keyboard.ts       # Keyboard monitoring
│   ├── actions.ts        # Text conversion actions
│   ├── utils.ts          # Utility functions
│   ├── types.ts          # TypeScript type definitions
│   └── constants.ts      # Application constants
├── assets/
│   ├── config.json       # Main configuration
│   └── dictionaries/     # Language layout dictionaries
├── test/                 # Test files
├── docs/                 # Documentation
├── scripts/              # Build and CI scripts
└── dist/                 # Compiled JavaScript files (generated)
```

## Development Scripts

### Building and Running

- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start built application
- `npm run prebuild` - Pre-build hook with status message
- `npm run postbuild` - Post-build hook with success message

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run check` - Run full quality check (lint + format + build)

### Testing

- `npm test` - Run comprehensive test suite
- `npm run test:full` - Run all tests including specialized tests
- `npm run test:alt-combinations` - Run Alt combinations tests for all languages
- `npm run test:comprehensive` - Run comprehensive test suite
- `npm run test:conversion` - Run basic conversion tests
- `npm run test:dictionaries` - Run dictionary validation tests
- `npm run test:integration` - Run integration tests

### Development Workflow

- `npm run ci:local` - Run local CI simulation
- `npm run precommit` - Pre-commit checks (quality + tests)

### Dependencies Management

- `npm run security:audit` - Run security audit
- `npm run security:fix` - Fix security vulnerabilities
- `npm run deps:check` - Check for outdated dependencies
- `npm run deps:update` - Update dependencies

### Release Management

- `npm run release:patch` - Create patch release (bug fixes)
- `npm run release:minor` - Create minor release (new features)
- `npm run release:major` - Create major release (breaking changes)

## Code Quality Standards

This project maintains high code quality standards using:

### TypeScript
- **Strict mode enabled** for type safety
- **Type definitions** in `src/types.ts`
- **Interface-based architecture** for maintainability

### ESLint
- **Modern ESLint configuration** in `eslint.config.ts`
- **Automatic linting** on pre-commit
- **Custom rules** for project-specific patterns

### Prettier
- **Consistent code formatting** across the project
- **Automatic formatting** on save (recommended VS Code setup)
- **Format checking** in CI pipeline

### Testing
- **Comprehensive test suites** covering all functionality
- **Performance benchmarks** for critical operations
- **Real-world scenario testing** for Ukrainian language support
- **100% test success rate** requirement

## Architecture Overview

### Core Components

1. **Configuration System** (`config.ts`)
   - Loads and validates configuration from `assets/config.json`
   - Manages language dictionaries and key bindings
   - Provides runtime configuration access

2. **Keyboard Monitoring** (`keyboard.ts`)
   - Global hotkey listener using `node-global-key-listener`
   - Hotkey combination parsing and matching
   - Event handling for keyboard shortcuts

3. **Text Conversion** (`actions.ts`, `utils.ts`)
   - Layout detection based on text patterns
   - Character-to-key mapping building
   - Text remapping between languages
   - Alt combination support

4. **Dictionary System** (`assets/dictionaries/`)
   - JSON-based keyboard layout definitions
   - Support for multiple layouts (QWERTY, QWERTZ, AZERTY, DVORAK)
   - Alt combination mappings for special characters

### Data Flow

1. **Hotkey Detection** → Keyboard listener catches configured hotkey
2. **Text Capture** → Selected text captured via clipboard simulation
3. **Language Detection** → Regex patterns identify source language
4. **Layout Mapping** → Character mapping built from dictionaries
5. **Text Conversion** → Text converted using layout mappings
6. **Text Replacement** → Converted text replaces original via clipboard

## Development Best Practices

### Code Style

- Use **meaningful variable names** and **descriptive function names**
- Add **JSDoc comments** for public functions and complex logic
- Keep **functions small and focused** on single responsibilities
- Use **async/await** for asynchronous operations
- Handle **errors gracefully** with proper error messages

### Testing

- Write **tests for new features** before implementing them
- Include **edge cases** and **error scenarios** in tests
- Use **descriptive test names** that explain what is being tested
- Add **performance tests** for critical operations
- Verify **cross-platform compatibility** when possible

### Documentation

- Update **README.md** for user-facing changes
- Update **documentation files** in `docs/` for developer changes
- Add **inline comments** for complex algorithms
- Include **examples** in documentation where helpful

### Git Workflow

- Use **conventional commit messages** (feat:, fix:, docs:, etc.)
- Create **feature branches** for new development
- Keep **commits focused** and atomic
- Write **descriptive commit messages** explaining the "why"

## Debugging

### Common Development Issues

**Build failures:**
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

**Test failures:**
```bash
# Rebuild before testing
npm run build
npm test
```

**Linting errors:**
```bash
# Auto-fix common issues
npm run lint:fix
```

**Permission errors during development:**
- Run with appropriate permissions
- Check file system access to `assets/` folder

### Debug Configuration

For VS Code debugging, create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/dist/index.js",
      "preLaunchTask": "npm: build",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Dependencies

### Runtime Dependencies

- **@nut-tree-fork/nut-js**: Cross-platform automation for clipboard operations
- **clipboardy**: Cross-platform clipboard access
- **node-global-key-listener**: Global hotkey monitoring

### Development Dependencies

- **TypeScript**: Type safety and modern JavaScript features
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **@types/node**: Node.js type definitions

## Performance Considerations

### Optimization Guidelines

- **Minimize memory usage** during text conversion
- **Cache dictionary data** to avoid repeated file reads
- **Use efficient algorithms** for character mapping
- **Avoid blocking operations** in hotkey handlers

### Performance Targets

- **Text conversion**: < 10ms for typical text (< 100 characters)
- **Dictionary loading**: < 50ms per dictionary
- **Memory usage**: < 50MB runtime footprint
- **Startup time**: < 2 seconds

## Platform-Specific Notes

### Windows
- Requires administrator privileges for global hotkeys
- Uses PowerShell for build scripts
- Clipboard access may require permission prompts

### macOS
- Requires accessibility permissions
- Uses bash/zsh for build scripts
- May require security approval for global key listening

### Linux
- Requires X11 or Wayland support
- Uses bash for build scripts
- May require additional permissions for clipboard access

## Continuous Integration

The project uses GitHub Actions for automated testing and deployment. See [CI/CD Documentation](GITHUB_SETUP.md) for details.

### CI Pipeline

1. **Lint and Format Check** - Code quality validation
2. **Build** - TypeScript compilation
3. **Test** - Comprehensive test suite execution
4. **Security Audit** - Dependency vulnerability scanning
5. **Cross-platform Testing** - Ubuntu, Windows, macOS validation

## Contributing

Ready to contribute? See [Contributing Guidelines](../CONTRIBUTING.md) for detailed information on:

- Code of conduct
- Pull request process
- Issue reporting
- Feature requests
- Code review guidelines
