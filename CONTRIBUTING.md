# Contributing to Node Layout Switcher

Thank you for your interest in contributing to Node Layout Switcher! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/node-layout-switcher.git
   cd node-layout-switcher
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes
2. Run the quality checks:
   ```bash
   npm run check
   ```
3. Run tests:
   ```bash
   npm run test:full
   ```
4. Commit your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```
5. Push to your fork and create a Pull Request

## Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check for linting errors
- Run `npm run format` to auto-format code
- Follow TypeScript best practices

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
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
