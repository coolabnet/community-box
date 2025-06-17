// GitHub API utilities for fetching release information

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  content_type: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  assets: GitHubAsset[];
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'coolabnet';
const REPO_NAME = 'community-box';

/**
 * Fetches the latest release from GitHub
 */
export async function getLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch latest release:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return null;
  }
}

/**
 * Gets the PDF download URL from the latest release
 * Returns the PDF URL if found, otherwise returns the latest release page URL
 */
export async function getPdfDownloadUrl(): Promise<string> {
  const fallbackUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

  try {
    const release = await getLatestRelease();

    if (!release) {
      return fallbackUrl;
    }

    // Look for PDF files in the assets
    const pdfAsset = release.assets.find(asset =>
      asset.name.toLowerCase().endsWith('.pdf') &&
      asset.content_type === 'application/pdf'
    );

    if (pdfAsset) {
      return pdfAsset.browser_download_url;
    }

    // If no PDF found, return the release page URL
    return release.html_url;
  } catch (error) {
    console.error('Error getting PDF download URL:', error);
    return fallbackUrl;
  }
}

/**
 * Gets all available download assets from the latest release
 */
export async function getDownloadAssets(): Promise<GitHubAsset[]> {
  try {
    const release = await getLatestRelease();
    return release?.assets || [];
  } catch (error) {
    console.error('Error getting download assets:', error);
    return [];
  }
}
