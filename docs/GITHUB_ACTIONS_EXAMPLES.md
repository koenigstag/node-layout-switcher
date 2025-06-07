# GitHub Actions Examples

This document provides examples of how the GitHub Actions workflows work in practice.

## Workflow Triggers

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Example scenario:**
```bash
# Developer pushes changes
git push origin feature/new-language-support

# GitHub Actions automatically:
# 1. Runs tests on Node.js 18, 20, 22
# 2. Checks code quality (ESLint, Prettier)
# 3. Builds TypeScript
# 4. Validates all dictionary files
# 5. Reports results on the PR
```

### 2. Release Workflow (`release.yml`)

**Triggers:**
- Git tags matching `v*` pattern

**Example scenario:**
```bash
# Create a new release
npm run release:minor

# This creates tag v1.3.0 and pushes it
# GitHub Actions automatically:
# 1. Runs all quality checks
# 2. Creates GitHub release with notes
# 3. Publishes to npm registry
# 4. Uploads release artifacts
```

### 3. PR Check Workflow (`pr-check.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Example scenario:**
When someone creates a PR adding Czech language support:
```markdown
## 🤖 Automated PR Check Results

✅ All checks have been completed!

- ESLint validation
- Prettier formatting check  
- TypeScript compilation
- All tests execution
- Dictionary files validation

Please review the workflow results above for any issues.
```

### 4. Security Workflow (`security.yml`)

**Triggers:**
- Daily at 2 AM UTC (scheduled)
- Push to `main` branch
- Pull requests to `main` branch

**Example output:**
```
🔍 Security Report Generated
📊 No vulnerabilities found
📦 2 packages have updates available:
  - @types/node: 22.15.30 → 22.16.0
  - typescript: 5.8.3 → 5.8.4
```

## Workflow Status Examples

### Successful CI Run

```
✅ CI
  ✅ test (ubuntu-latest, 18.x) - 2m 34s
  ✅ test (ubuntu-latest, 20.x) - 2m 28s  
  ✅ test (ubuntu-latest, 22.x) - 2m 31s
  ✅ code-quality - 1m 45s
```

### Failed CI Run

```
❌ CI
  ❌ test (ubuntu-latest, 20.x) - 1m 12s
    ESLint found 3 errors in src/utils.ts
  ✅ test (ubuntu-latest, 18.x) - 2m 34s
  ✅ test (ubuntu-latest, 22.x) - 2m 31s  
  ✅ code-quality - 1m 45s
```

### Successful Release

```
✅ Release v1.2.0
  ✅ release - 3m 45s
    📦 GitHub release created
    📤 Published to npm: node-layout-switcher@1.2.0
    📎 Artifacts uploaded
  ✅ npm-publish - 1m 23s
```

## Dependabot Examples

### Weekly Dependency Update

```
🤖 Dependabot
📝 Bump @typescript-eslint/eslint-plugin from 8.33.1 to 8.34.0
🏷️ Labels: dependencies, automated
👤 Assigned: koenigstag

Updates @typescript-eslint/eslint-plugin requirement from 8.33.1 to 8.34.0
```

### Security Update

```
🚨 Dependabot Security Alert
📝 Bump lodash from 4.17.19 to 4.17.21
🏷️ Labels: dependencies, security, automated
🔒 Fixes known security vulnerabilities

This update fixes 2 security vulnerabilities:
- CVE-2021-23337: Moderate severity
- CVE-2020-28500: High severity
```

## Local Development Integration

### Pre-commit Hook Example

```bash
# Run before every commit
npm run ci:local

🚀 Running local CI simulation...

🔄 Installing dependencies...
✅ Installing dependencies completed successfully

🔄 Running ESLint...
✅ Running ESLint completed successfully

🔄 Checking code formatting...
✅ Checking code formatting completed successfully

🔄 Building TypeScript...
✅ Building TypeScript completed successfully

🔄 Running all tests...
✅ Running all tests completed successfully

==================================================
🎉 All CI checks passed! Your code is ready for GitHub.
==================================================
```

### Failed Local Check

```bash
npm run ci:local

🔄 Running ESLint...
❌ Running ESLint failed:
  Error: src/utils.ts(45,7): error TS2304: Cannot find name 'console'.

💥 Some CI checks failed. Please fix the issues before pushing.
```

## Branch Protection in Action

When branch protection rules are enabled:

### ✅ Successful Merge
```
✅ All checks passed
✅ Branch is up to date
✅ Required reviews: 1/1
🟢 Ready to merge
```

### ❌ Blocked Merge
```
❌ Some checks failed
  - test (ubuntu-latest, 20.x): failing
❌ Branch is 2 commits behind main
❌ Required reviews: 0/1
🔴 Merge blocked
```

## Monitoring and Notifications

### GitHub Actions Dashboard

View at: `https://github.com/koenigstag/node-layout-switcher/actions`

Recent workflow runs:
```
🟢 CI #45     main     2m ago    ✅ All checks passed
🟢 Release #12 v1.2.0   1h ago    ✅ Released successfully  
🔴 CI #44     pr-123    3h ago    ❌ Tests failed
🟢 Security #8 main     1d ago    ✅ No vulnerabilities
```

### Email Notifications

GitHub automatically sends notifications for:
- ❌ Failed workflow runs
- ✅ Fixed previously failing workflows
- 🔒 Security alerts
- 📦 Dependabot updates

## Best Practices Demonstrated

1. **Multi-version Testing**: Ensures compatibility across Node.js versions
2. **Code Quality Gates**: Prevents poor quality code from being merged
3. **Automated Security**: Regular security audits and updates
4. **Consistent Formatting**: Enforces code style standards
5. **Automated Releases**: Reduces manual release management overhead
6. **Comprehensive Testing**: Multiple test types (unit, integration, validation)

## Troubleshooting Workflows

### Common Issues and Solutions

1. **Node.js Version Mismatch**
   ```yaml
   # Fix in workflow
   - uses: actions/setup-node@v4
     with:
       node-version: '20.x'  # Use specific version
   ```

2. **Missing Secrets**
   ```bash
   Error: NPM_TOKEN is not set
   ```
   Solution: Add NPM_TOKEN in repository secrets

3. **Test Timeouts**
   ```yaml
   # Add timeout to workflow
   jobs:
     test:
       timeout-minutes: 10
   ```

4. **Cache Issues**
   ```bash
   # Clear actions cache
   # Settings → Actions → Management → Clear cache
   ```

This automated setup ensures code quality, security, and reliable releases! 🚀
