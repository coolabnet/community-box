# GitHub Workflows

This directory contains GitHub Actions workflows for automating tasks in the Community Box project.

## Available Workflows

### Deploy to GitHub Pages

**File:** [workflows/deploy.yml](./workflows/deploy.yml)

This workflow automatically deploys the web application from the `./app` directory to GitHub Pages whenever changes are pushed to the main branch.

#### What it does:

1. Checks out the repository code
2. Sets up Node.js environment
3. Installs dependencies for the app
4. Builds the application with production settings
5. Configures GitHub Pages
6. Uploads the built application as an artifact
7. Deploys the artifact to GitHub Pages

#### Configuration:

The workflow is configured to:
- Run on pushes to the main branch
- Allow manual triggering via the "Actions" tab
- Use the repository name as the base path for the application

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
