#!/usr/bin/env node

const { fetchWithRetry, saveToJson, runScript } = require('./utils/common');

/**
 * Fetch YunoHost apps from GitHub repository
 * YunoHost apps are stored as individual repositories in the YunoHost-Apps organization
 */
async function getYunoHostApps() {
  const url = 'https://api.github.com/orgs/YunoHost-Apps/repos';

  try {
    // Fetch all repositories from YunoHost-Apps organization
    let allRepos = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const pageUrl = `${url}?page=${page}&per_page=${perPage}&sort=name`;
      const data = await fetchWithRetry(pageUrl);

      if (!Array.isArray(data) || data.length === 0) {
        break;
      }

      allRepos = allRepos.concat(data);

      if (data.length < perPage) {
        break; // Last page
      }

      page++;
    }

    // Filter for YunoHost app repositories (typically end with _ynh)
    const appRepos = allRepos
      .filter(repo => repo.name.endsWith('_ynh'))
      .map(repo => ({
        id: repo.name,
        name: repo.name.replace('_ynh', ''),
        description: repo.description || '',
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated_at: repo.updated_at,
        language: repo.language,
        archived: repo.archived
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const metadata = {
      source: 'YunoHost-Apps GitHub Organization',
      url: 'https://github.com/YunoHost-Apps',
      api_url: url,
      total_apps: appRepos.length,
      total_repos_checked: allRepos.length,
      languages: [...new Set(appRepos.map(app => app.language).filter(Boolean))].sort(),
      archived_count: appRepos.filter(app => app.archived).length
    };

    saveToJson('yunohost-apps.json', appRepos, metadata);

    console.log(`Found ${appRepos.length} YunoHost apps from ${allRepos.length} repositories`);
    console.log(`Languages: ${metadata.languages.join(', ')}`);
    console.log(`Archived apps: ${metadata.archived_count}`);

    return {
      count: appRepos.length,
      apps: appRepos,
      languages: metadata.languages,
      archived_count: metadata.archived_count
    };

  } catch (error) {
    console.error('Failed to fetch YunoHost apps:', error.message);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  runScript(getYunoHostApps, 'YunoHost Apps');
}

module.exports = { getYunoHostApps };
