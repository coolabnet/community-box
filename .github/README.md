# GitHub Workflows

This directory contains GitHub Actions workflows for automating tasks in the Community Box project.

## Available Workflows

### 1. Deploy to GitHub Pages

**File:** [workflows/deploy.yml](./workflows/deploy.yml)

This workflow automatically fetches the latest data, builds, and deploys the web application to GitHub Pages whenever changes are pushed to the main branch.

#### What it does:

1. Checks out the repository code
2. Sets up Node.js environment for data fetching
3. Installs dependencies (npm) and runs data fetching scripts
4. Commits any data changes back to the repository
5. Sets up Bun environment for the app
6. Installs dependencies (Bun) for the app
7. Builds the application with production settings
8. Configures GitHub Pages
9. Uploads the built application as an artifact
10. Deploys the artifact to GitHub Pages

#### Configuration:

The workflow is configured to:
- Run on pushes to the main branch
- Allow manual triggering via the "Actions" tab
- Use the repository name as the base path for the application
- Automatically fetch and commit latest data before deployment

#### Requirements:

To use this workflow, you need to:

1. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Set the source to "GitHub Actions"

2. Make sure your application is properly configured for GitHub Pages:
   - The `vite.config.ts` file has been updated to use the correct base path in production

#### Troubleshooting:

If the deployment fails, check:
- The build logs for any errors
- That GitHub Pages is properly enabled
- That the permissions for the GitHub token are correct

### 2. Fetch Latest Data

**File:** [workflows/data-fetch.yml](./workflows/data-fetch.yml)

This workflow runs the data fetching scripts to keep research data up-to-date.

#### What it does:

1. Checks out the repository code
2. Sets up Node.js environment
3. Installs dependencies (npm) for data fetching scripts
4. Runs all data fetching scripts
5. Runs tests to verify data integrity
6. Commits any changes back to the repository

#### Configuration:

The workflow is configured to:
- Run daily at 6 AM UTC (scheduled)
- Allow manual triggering via the "Actions" tab
- Skip CI on commits to avoid triggering other workflows

### 3. Generate PDF for Release

**File:** [workflows/release-pdf.yml](./workflows/release-pdf.yml)

This workflow generates a PDF report and attaches it to releases.

#### What it does:

1. Checks out the repository code
2. Sets up Node.js environment
3. Installs dependencies (npm) for PDF generation
4. Generates the PDF using the gen-pdf scripts
5. Uploads the PDF as a release asset
6. Updates the release description with a download link

#### Configuration:

The workflow is configured to:
- Run automatically when a new release is published
- Allow manual triggering for testing purposes
- Support specifying a tag name for manual runs

## Package Managers

The workflows use different package managers based on the directory:

- **App (`./app`)**: Uses **Bun** (has `bun.lockb`)
  - Setup: `oven-sh/setup-bun@v2`
  - Install: `bun install --frozen-lockfile`
  - Run: `bun run <script>`

- **Data Scripts (`./scripts/fetch-data`)**: Uses **npm** (has `package-lock.json`)
  - Setup: `actions/setup-node@v4` with npm cache
  - Install: `npm install --frozen-lockfile` (safer than `npm ci`)
  - Run: `npm run <script>`

- **PDF Generation (`./scripts/gen-pdf`)**: Uses **npm** (has `package-lock.json`)
  - Setup: `actions/setup-node@v4` with npm cache
  - Install: `npm install --frozen-lockfile` (safer than `npm ci`)
  - Run: `npm run <script>`

## Permissions

All workflows require appropriate permissions:
- `contents: write` - To commit data changes and upload release assets
- `pages: write` - For GitHub Pages deployment (deploy workflow only)
- `id-token: write` - For GitHub Pages deployment (deploy workflow only)
