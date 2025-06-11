#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Common utilities for data fetching scripts
 */

// Default configuration
const DEFAULT_CONFIG = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000
};

/**
 * Create output directory if it doesn't exist
 * @param {string} dirPath - Directory path to create
 */
function ensureOutputDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Make HTTP request with retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
async function fetchWithRetry(url, options = {}) {
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    headers: {
      'User-Agent': DEFAULT_CONFIG.userAgent,
      ...options.headers
    }
  };

  let lastError;
  
  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      console.log(`Fetching: ${url} (attempt ${attempt}/${config.retries})`);
      
      const response = await axios.get(url, {
        headers: config.headers,
        timeout: config.timeout
      });
      
      return response.data;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < config.retries) {
        console.log(`Retrying in ${config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Save data to JSON file with metadata
 * @param {string} filename - Output filename
 * @param {any} data - Data to save
 * @param {Object} metadata - Additional metadata
 */
function saveToJson(filename, data, metadata = {}) {
  const outputDir = path.resolve(__dirname, '../../../research/fetched-data');
  ensureOutputDir(outputDir);
  
  const outputPath = path.join(outputDir, filename);
  
  const output = {
    timestamp: new Date().toISOString(),
    script: path.basename(process.argv[1] || 'unknown'),
    ...metadata,
    data
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Saved ${Array.isArray(data) ? data.length : 'data'} items to: ${outputPath}`);
  
  return outputPath;
}

/**
 * Parse GitHub API response for file listings
 * @param {Array} items - GitHub API response items
 * @param {string} extension - File extension to filter (optional)
 * @returns {Array} Parsed file names
 */
function parseGitHubFiles(items, extension = null) {
  if (!Array.isArray(items)) {
    throw new Error('Expected array of GitHub API items');
  }
  
  return items
    .filter(item => item.type === 'file')
    .map(item => item.name)
    .filter(name => extension ? name.endsWith(extension) : true)
    .map(name => extension ? name.replace(new RegExp(`\\${extension}$`), '') : name)
    .sort();
}

/**
 * Parse GitHub API response for directory listings
 * @param {Array} items - GitHub API response items
 * @returns {Array} Directory names
 */
function parseGitHubDirs(items) {
  if (!Array.isArray(items)) {
    throw new Error('Expected array of GitHub API items');
  }
  
  return items
    .filter(item => item.type === 'dir')
    .map(item => item.name)
    .sort();
}

/**
 * Handle script execution with error handling
 * @param {Function} scriptFunction - Main script function to execute
 * @param {string} scriptName - Name of the script for logging
 */
async function runScript(scriptFunction, scriptName) {
  try {
    console.log(`\n=== Running ${scriptName} ===`);
    const startTime = Date.now();
    
    await scriptFunction();
    
    const duration = Date.now() - startTime;
    console.log(`✅ ${scriptName} completed in ${duration}ms`);
    
  } catch (error) {
    console.error(`❌ ${scriptName} failed:`, error.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Validate required environment or check if running in test mode
 * @returns {boolean} Whether running in test mode
 */
function isTestMode() {
  return process.env.NODE_ENV === 'test';
}

module.exports = {
  DEFAULT_CONFIG,
  ensureOutputDir,
  fetchWithRetry,
  saveToJson,
  parseGitHubFiles,
  parseGitHubDirs,
  runScript,
  isTestMode
};
