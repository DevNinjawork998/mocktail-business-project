# CI/CD Setup Guide

This document explains the GitHub Actions CI/CD setup for automated testing, type checking, linting, and deployment.

## Overview

The project includes two main workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`): Runs quality checks on every push and pull request
2. **Vercel Deployment Workflow** (`.github/workflows/vercel-deploy.yml`): Deploys to Vercel after quality checks pass

## CI Workflow Steps

### Quality Checks Job

1. **Checkout code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js 20 with npm caching
3. **Install dependencies** - Runs `npm ci` for clean install
4. **Setup Prisma for CI** - Copies dev schema (SQLite) for testing
5. **Generate Prisma Client** - Generates Prisma types for TypeScript
6. **Type checking** - Runs `npm run type-check`
7. **Linting** - Runs `npm run lint`
8. **Tests** - Runs `npm run test:ci` with coverage

### Build Check Job

1. **Checkout code** - Gets the latest code
2. **Setup Node.js** - Installs Node.js 20
3. **Install dependencies** - Runs `npm ci`
4. **Setup Prisma for Build** - Uses production schema (PostgreSQL)
5. **Generate Prisma Client** - Generates Prisma types
6. **Build project** - Runs `npm run build` to verify it compiles

## Prisma Setup in CI

### Why Prisma Setup is Needed

- Prisma Client must be generated before TypeScript type checking
- Tests don't need a real database connection (they're mocked)
- Build process needs Prisma Client for server-side code

### Schema Selection

- **For Tests**: Uses `schema.dev.prisma` (SQLite) - no real DB needed
- **For Build**: Uses `schema.prod.prisma` (PostgreSQL) - matches production

### Environment Variables

Tests use mock environment variables:

- `DATABASE_URL: "file:./dev.db"` - SQLite for Prisma generate
- `NODE_ENV: "test"` - Test environment
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_dummy_key_for_ci"` - Mock Stripe key
- `NEXT_PUBLIC_ENABLE_CTABANNER: "false"` - Feature flag
- `NEXT_PUBLIC_APP_URL: "http://localhost:3000"` - Mock app URL

## Common Issues and Solutions

### Issue: Prisma Client Not Generated

**Solution**: Ensure the Prisma setup step runs before type checking:

```yaml
- name: Setup Prisma for CI
  run: |
    if [ ! -f prisma/schema.prisma ] || ! grep -q "provider = \"sqlite\"" prisma/schema.prisma; then
      cp prisma/schema.dev.prisma prisma/schema.prisma
    fi
  env:
    DATABASE_URL: "file:./dev.db"

- name: Generate Prisma Client
  run: npx prisma generate --schema=./prisma/schema.prisma
```

### Issue: Tests Failing Due to Missing Environment Variables

**Solution**: Add required environment variables to the test step:

```yaml
- name: Run tests
  run: npm run test:ci
  env:
    DATABASE_URL: "file:./dev.db"
    NODE_ENV: "test"
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_dummy_key_for_ci"
```

### Issue: Type Checking Failing

**Solution**: Ensure Prisma Client is generated before type checking:

1. Prisma setup step must run first
2. Prisma generate must complete successfully
3. DATABASE_URL must be set (even if dummy)

## Testing Locally

To test the CI workflow locally:

```bash
# Install dependencies
npm ci

# Setup Prisma (use dev schema)
cp prisma/schema.dev.prisma prisma/schema.prisma

# Generate Prisma Client
DATABASE_URL="file:./dev.db" npx prisma generate

# Run type check
DATABASE_URL="file:./dev.db" NODE_ENV="test" npm run type-check

# Run lint
npm run lint

# Run tests
DATABASE_URL="file:./dev.db" NODE_ENV="test" \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_dummy" \
  NEXT_PUBLIC_ENABLE_CTABANNER="false" \
  NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  npm run test:ci
```

## Workflow Triggers

### CI Workflow

- **Triggers**: Push to `main`, `master`, `develop` branches
- **Triggers**: Pull requests to `main`, `master`, `develop` branches
- **Purpose**: Validate code quality before merge

### Vercel Deployment Workflow

- **Triggers**: Push to `main` or `master` branches only
- **Requires**: Quality checks job must pass first
- **Purpose**: Deploy validated code to production

## Required GitHub Secrets

For Vercel deployment, these secrets must be set:

1. `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
2. `VERCEL_ORG_ID` - Find in Vercel Dashboard → Settings → General
3. `VERCEL_PROJECT_ID` - Find in Vercel Dashboard → Project Settings → General

Optional (for build check):

- `DATABASE_URL` - Production database URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

## Monitoring CI/CD

1. **GitHub Actions Tab**: View workflow runs and logs
2. **Pull Request Checks**: See status directly in PR
3. **Vercel Dashboard**: Monitor deployment status

## Best Practices

1. **Always run tests locally** before pushing
2. **Check CI status** before merging PRs
3. **Fix failing tests immediately** - don't merge broken code
4. **Keep environment variables** in sync between local and CI
5. **Update this document** when adding new CI steps

## Troubleshooting

### Workflow Not Running

- Check that workflow files are in `.github/workflows/`
- Verify branch names match workflow triggers
- Check GitHub Actions is enabled in repository settings

### Tests Failing in CI but Passing Locally

- Compare environment variables
- Check Node.js version matches (CI uses Node 20)
- Verify all dependencies are in `package.json` (not just `package-lock.json`)

### Prisma Generate Failing

- Ensure schema file exists
- Check DATABASE_URL is set
- Verify schema syntax is correct

### Build Failing

- Check all environment variables are set
- Verify Prisma Client is generated
- Review build logs for specific errors
