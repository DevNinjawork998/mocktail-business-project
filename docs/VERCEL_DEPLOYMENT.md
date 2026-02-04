# Vercel Deployment Guide

This guide will help you deploy your cocktail business application to Vercel with Prisma Accelerate.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Prisma Cloud Account**: Set up at https://cloud.prisma.io
3. **GitHub Repository**: Your code should be in a Git repository

## Step 1: Set Up Prisma Cloud

1. **Create Prisma Cloud Account**:
   - Visit https://cloud.prisma.io
   - Sign up with your GitHub account
   - Create a new project

2. **Set Up Database**:
   - Choose PostgreSQL as your database
   - Follow the setup wizard
   - Note down your connection strings

3. **Get Connection Strings**:
   - **DATABASE_URL**: Your Prisma Accelerate connection string
   - **DIRECT_URL**: Your direct PostgreSQL connection string

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. **Link to Vercel**:

   ```bash
   vercel link
   ```

   - Follow the authentication prompts
   - Choose your Vercel account
   - Link to existing project or create new

3. **Set Environment Variables**:

   ```bash
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   ```

   - Enter your Prisma Cloud connection strings when prompted

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. **Connect Repository**:
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `DATABASE_URL`: Your Prisma Accelerate URL
     - `DIRECT_URL`: Your direct PostgreSQL URL

4. **Deploy**:
   - Click "Deploy"

## Step 3: Database Setup

After deployment, you need to set up your production database:

1. **Switch to Production Schema**:

   ```bash
   npm run db:prod
   ```

2. **Run Migrations**:

   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Database**:
   ```bash
   npm run db:seed
   ```

**Important**: The build process automatically switches to production schema, so you don't need to manually run `npm run db:prod` before deployment.

## Step 4: Verify Deployment

1. **Check Your App**: Visit your Vercel deployment URL
2. **Test API Endpoints**:
   - `https://your-app.vercel.app/api/products`
   - `https://your-app.vercel.app/shop`

## Environment Variables

Make sure these are set in your Vercel project:

```env
# Prisma Accelerate connection string
DATABASE_URL="prisma://aws-us-east-1.prisma-data.com/__YOUR_ACCELERATE_URL__"

# Direct database connection (for migrations)
DIRECT_URL="postgresql://username:password@host:port/database"

# Next.js environment
NODE_ENV="production"
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Prisma client is generated: `npx prisma generate`

2. **Database Connection Issues**:
   - Verify environment variables are set correctly
   - Check Prisma Cloud dashboard for connection status

3. **API Timeouts**:
   - Increase function timeout in `vercel.json`
   - Check Prisma Accelerate connection pooling settings

### Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Pull environment variables
vercel env pull

# Redeploy
vercel --prod
```

## Performance Optimization

1. **Prisma Accelerate**: Automatically handles connection pooling
2. **Edge Functions**: API routes run on Vercel's edge network
3. **Caching**: Leverage Vercel's global CDN

## Monitoring

1. **Vercel Analytics**: Built-in performance monitoring
2. **Prisma Cloud**: Database performance and query analytics
3. **Error Tracking**: Monitor application errors in Vercel dashboard

## Step 5: GitHub Actions CI/CD Setup

This project includes GitHub Actions workflows to automatically run quality checks and deploy to Vercel.

### Workflows Included

1. **CI Workflow** (`.github/workflows/ci.yml`):
   - Runs on every push and pull request
   - Performs TypeScript type checking
   - Runs ESLint
   - Executes test suite
   - Validates build process

2. **Vercel Deployment Workflow** (`.github/workflows/vercel-deploy.yml`):
   - Runs only on pushes to `main` or `master` branches
   - Runs quality checks first (type check, lint, tests)
   - Only deploys if all checks pass
   - Deploys to Vercel production

### Required GitHub Secrets

To enable Vercel deployment via GitHub Actions, you need to set up the following secrets in your GitHub repository:

1. **Go to your GitHub repository** → Settings → Secrets and variables → Actions

2. **Add the following secrets**:
   - `VERCEL_TOKEN`: Your Vercel authentication token
     - Get it from: https://vercel.com/account/tokens
     - Create a new token with full access

   - `VERCEL_ORG_ID`: Your Vercel organization ID
     - Find it in: Vercel Dashboard → Settings → General → Organization ID

   - `VERCEL_PROJECT_ID`: Your Vercel project ID
     - Find it in: Vercel Dashboard → Your Project → Settings → General → Project ID

3. **Optional Environment Variables** (if needed for build):
   - `DATABASE_URL`: Already set in Vercel, but can be added to GitHub Secrets if needed
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: If using Stripe

### How It Works

1. **On Pull Requests**:
   - CI workflow runs automatically
   - Type checking, linting, and tests must pass
   - No deployment occurs

2. **On Push to Main/Master**:
   - CI workflow runs first
   - If CI passes, Vercel deployment workflow runs
   - Quality checks run again in deployment workflow
   - If all checks pass, code is deployed to Vercel production

### Manual Setup Steps

1. **Get Vercel Credentials**:

   ```bash
   # Install Vercel CLI if not already installed
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Link your project (if not already linked)
   vercel link
   ```

2. **Find Your IDs**:
   - After linking, check `.vercel/project.json` for `orgId` and `projectId`
   - Or find them in Vercel Dashboard → Project Settings

3. **Add Secrets to GitHub**:
   - Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
   - Click "New repository secret"
   - Add each secret: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Testing the Workflow

1. **Create a test branch**:

   ```bash
   git checkout -b test-ci
   ```

2. **Make a small change** and commit:

   ```bash
   git add .
   git commit -m "Test CI workflow"
   git push origin test-ci
   ```

3. **Create a Pull Request**:
   - Go to GitHub and create a PR
   - Check the "Actions" tab to see CI running
   - All checks should pass

4. **Merge to Main**:
   - Once PR is merged, the deployment workflow will run
   - Check the Actions tab to see deployment progress

### Troubleshooting GitHub Actions

1. **Workflow not running**:
   - Check that workflows are enabled: Settings → Actions → General
   - Ensure workflow files are in `.github/workflows/` directory

2. **Vercel deployment failing**:
   - Verify all secrets are set correctly
   - Check Vercel token hasn't expired
   - Ensure project is linked correctly

3. **Tests failing in CI**:
   - Run tests locally: `npm run test:ci`
   - Check that all environment variables are available
   - Verify test setup matches local environment

### Benefits of This Setup

- ✅ **Automated Quality Checks**: Every commit is validated
- ✅ **Prevents Bad Deployments**: Only tested code reaches production
- ✅ **Faster Feedback**: Know immediately if code has issues
- ✅ **Consistent Deployments**: Same process every time
- ✅ **Team Collaboration**: PRs must pass checks before merge

## Next Steps

1. **Set up custom domain** (optional)
2. **Configure GitHub Actions** (see Step 5 above)
3. **Set up monitoring and alerts**
4. **Optimize performance** based on analytics

Your application is now deployed and ready for production! 🚀
