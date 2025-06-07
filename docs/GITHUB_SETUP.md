# GitHub Setup Instructions

This document provides step-by-step instructions for setting up GitHub Actions and configuring your repository.

## Prerequisites

1. Your code should be in a GitHub repository
2. You should have admin access to the repository

## Repository Settings

### 1. Branch Protection Rules

Navigate to **Settings** → **Branches** and add protection rules for the `main` branch:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Required status checks:
    - `test (ubuntu-latest, 18.x)`
    - `test (ubuntu-latest, 20.x)` 
    - `test (ubuntu-latest, 22.x)`
    - `code-quality`
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators

### 2. Secrets Configuration

Navigate to **Settings** → **Secrets and variables** → **Actions** and add:

#### Required Secrets:
- `NPM_TOKEN` - Your NPM publishing token (for automated releases)
  - Get from: https://www.npmjs.com/settings/tokens
  - Type: "Automation" token

#### Optional Secrets:
- `CODECOV_TOKEN` - If you want code coverage reporting
- `SLACK_WEBHOOK` - For Slack notifications

### 3. Repository Variables

Navigate to **Settings** → **Secrets and variables** → **Actions** → **Variables**:

- `NODEJS_VERSION` = `20.x` (default Node.js version)
- `ENABLE_NOTIFICATIONS` = `true` (enable workflow notifications)

## Workflow Configuration

### Available Workflows

1. **CI (`ci.yml`)** - Runs on every push and PR
   - Tests on multiple Node.js versions
   - Runs linting and formatting checks
   - Builds TypeScript
   - Runs all tests

2. **Release (`release.yml`)** - Runs on version tags
   - Creates GitHub releases
   - Publishes to NPM (if configured)
   - Generates release notes

3. **PR Check (`pr-check.yml`)** - Enhanced PR validation
   - Validates dictionary files
   - Checks for TODO/FIXME comments
   - Adds automated comments to PRs

4. **Security (`security.yml`)** - Security monitoring
   - Daily dependency audits
   - Outdated package checks
   - Dependency review on PRs

### Dependabot Configuration

Dependabot is configured to:
- Check for npm dependency updates weekly
- Check for GitHub Actions updates weekly
- Group updates by type (dev/prod dependencies)
- Auto-assign PRs to maintainers

## Local Development

### Pre-commit Checks

Run before committing:
```bash
npm run ci:local
```

This simulates what GitHub Actions will do.

### Creating Releases

1. **Patch release** (bug fixes):
   ```bash
   npm run release:patch
   ```

2. **Minor release** (new features):
   ```bash
   npm run release:minor
   ```

3. **Major release** (breaking changes):
   ```bash
   npm run release:major
   ```

These commands will:
- Update the version in package.json
- Create a git tag
- Push changes and tags to GitHub
- Trigger the release workflow

## Issue Templates

The repository includes templates for:
- 🐛 Bug reports
- ✨ Feature requests  
- 🌍 New language support requests

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run ci:local` to verify
5. Push and create a PR
6. GitHub Actions will automatically:
   - Run all tests
   - Check code quality
   - Validate changes
   - Add status comments

## Monitoring

### GitHub Actions Dashboard

Monitor workflow runs at:
`https://github.com/YOUR_USERNAME/node-layout-switcher/actions`

### Status Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/YOUR_USERNAME/node-layout-switcher/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/node-layout-switcher/actions)
[![Security Check](https://github.com/YOUR_USERNAME/node-layout-switcher/workflows/Security%20Check/badge.svg)](https://github.com/YOUR_USERNAME/node-layout-switcher/actions)
[![Release](https://github.com/YOUR_USERNAME/node-layout-switcher/workflows/Release/badge.svg)](https://github.com/YOUR_USERNAME/node-layout-switcher/actions)
```

## Troubleshooting

### Common Issues

1. **NPM Publish Fails**
   - Check if `NPM_TOKEN` secret is configured
   - Verify token has publish permissions
   - Ensure package name is available on NPM

2. **Tests Fail on Different Node.js Versions**
   - Check for Node.js version-specific dependencies
   - Update minimum Node.js version in package.json engines field

3. **ESLint Warnings in CI**
   - Run `npm run lint:fix` locally
   - Check that all files are properly formatted

### Getting Help

1. Check the Actions logs for detailed error messages
2. Review the CONTRIBUTING.md file
3. Open an issue with the "question" label

## Next Steps

1. Push your code to GitHub
2. Configure branch protection rules
3. Add NPM token for releases
4. Test a PR to verify workflows work
5. Create your first release tag

Happy coding! 🚀
