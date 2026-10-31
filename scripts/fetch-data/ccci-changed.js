#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * Decides whether the CCCI snapshot changed in the commit about to be made.
 * Compares parsed JSON with HEAD, ignoring the wrapper timestamp and
 * data.source.retrievedAt. Prints ccci_changed=true|false and appends the
 * same line to $GITHUB_OUTPUT when set.
 */

const REPO_ROOT = path.resolve(__dirname, '../..');
const FILE = 'research/fetched-data/ccci-directory.json';

/**
 * Drop the fields that change on every run.
 * @param {Object} json - Parsed snapshot
 * @returns {string} Stable comparison string
 */
function comparable(json) {
  const copy = JSON.parse(JSON.stringify(json));
  delete copy.timestamp;
  if (copy.data && copy.data.source) delete copy.data.source.retrievedAt;
  return JSON.stringify(copy);
}

/**
 * @param {string|null} headText - HEAD content, or null when HEAD has no file
 * @param {string} workingText - Working or staged content
 * @returns {boolean} True when the snapshot changed beyond run-specific fields
 */
function ccciChanged(headText, workingText) {
  if (headText === null || headText === undefined) return true;
  return comparable(JSON.parse(headText)) !== comparable(JSON.parse(workingText));
}

function readHead(file) {
  try {
    return execFileSync('git', ['show', `HEAD:${file}`], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch {
    return null;
  }
}

function report(changed) {
  const line = `ccci_changed=${changed}`;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${line}\n`);
  }
  console.log(line);
}

if (require.main === module) {
  const workingPath = path.join(REPO_ROOT, FILE);
  if (!fs.existsSync(workingPath)) {
    report(false);
  } else {
    report(ccciChanged(readHead(FILE), fs.readFileSync(workingPath, 'utf8')));
  }
}

module.exports = { ccciChanged, comparable };
