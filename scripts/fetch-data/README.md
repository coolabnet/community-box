# Community Box Data Fetching Scripts

This directory contains JavaScript scripts to fetch data about various community box platforms and services. All scripts output JSON files to the `research/fetched-data/` directory.

## Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run all data fetching scripts
npm run fetch-all

# Run tests to verify everything works
npm test
```

## Available Scripts

### Individual Scripts

1. **CapRover UI Translations** (`get-caprover-ui-translations.js`)
   - Fetches available UI translation languages for CapRover
   - Source: GitHub API (caprover/caprover-frontend)
   - Output: `caprover-ui-translations.json`

2. **CasaOS UI Translations** (`get-casaos-ui-translations.js`)
   - Fetches available UI translation languages for CasaOS
   - Source: GitHub API (IceWhaleTech/CasaOS-App-UI)
   - Output: `casaos-ui-translations.json`

3. **YunoHost Apps** (`get-yunohost-apps.js`)
   - Fetches list and metadata of available YunoHost applications
   - Source: YunoHost Apps API
   - Output: `yunohost-apps.json`

4. **YunoHost Docs Translations** (`get-yunohost-docs-translations.js`)
   - Fetches available documentation translation languages
   - Source: GitHub API (YunoHost/doc)
   - Output: `yunohost-docs-translations.json`

5. **YunoHost UI Translations** (`get-yunohost-ui-translations.js`)
   - Fetches UI translation progress with percentages
   - Source: YunoHost Translation API
   - Output: `yunohost-ui-translations.json`

6. **Zimaboard Shipping Areas** (`get-zimaboard-shipping-areas.js`)
   - Scrapes shipping countries/areas from ZimaSpace website
   - Source: Web scraping (zimaspace.com)
   - Output: `zimaboard-shipping-areas.json`

7. **CCCI Directory** (`get-ccci-directory.js`)
   - Downloads the CCCI (Colnodo / APC) community-network directory CSV and merges it with the Community Box curated list (`research/results/community-directory.curated.json`)
   - Source: https://app.agenteccci.colnodo.org/explore (export: https://app.agenteccci.colnodo.org/explore/export)
   - Output: `ccci-directory.json`
   - Only translatable/structured fields are kept: id, name, ISO 3166-1 alpha-2 country, status, Yes-only service keys, website (http(s) only) and sources (`ccci`, `communityBox`). Free-text columns (goals, nature, category, region, area type) are dropped.
   - Safety: if the download fails, the header lacks ID/Name/Country, or fewer than 50 valid rows parse, the script throws and leaves the existing output unchanged.
   - Country names not in the explicit mapping are set to `null` and listed in `unmatchedCountries` (with a console warning). `Global` and empty countries are `null` without being listed.
   - Curated entries may list `aliases` (other spellings of the same network in the same country) so they merge into the CCCI record instead of appearing twice.
   - Publishing: the site bundles this file at build time. The daily `Fetch Latest Data` workflow dispatches a deploy when the directory changes, and every Monday regardless.
   - Republishing the CCCI export was authorized by Colnodo / APC on 2026-10-31.

   Sample run (abridged):
   ```
   $ node get-ccci-directory.js
   CCCI rows: 428, networks: 428, curated matched: 7, curated added: 15, unmatched countries: 0
   Saved data items to: .../research/fetched-data/ccci-directory.json
   ✅ CCCI Directory completed in 1729ms
   ```

### Master Script

- **Run All** (`run-all.js`)
  - Executes all individual scripts in sequence
  - Generates execution summary
  - Output: All individual JSON files + `_execution_summary.json`

## NPM Commands

```bash
# Run all scripts
npm run fetch-all

# Run individual scripts
npm run get-caprover-translations
npm run get-casaos-translations
npm run get-yunohost-apps
npm run get-yunohost-docs
npm run get-yunohost-ui
npm run get-shipping-areas
npm run get-ccci-directory

# Run tests
npm test
```

## Output Format

All scripts generate JSON files with a consistent structure:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "script": "script-name.js",
  "source": "Data source description",
  "url": "https://source-url.com",
  "count": 42,
  "data": [
    // Actual fetched data
  ]
}
```

## Testing

The test suite (`test/scripts.test.js`) verifies:

- All script functions execute without errors
- Output directory is created
- JSON files are valid and have required fields
- Data is not empty
- File structure is consistent

Run tests with:
```bash
npm test
```

## Error Handling

- All scripts include retry logic for network requests
- Failed scripts don't stop the execution of other scripts
- Detailed error messages and execution summaries are provided
- Test mode prevents scripts from exiting on errors

## Dependencies

- `axios`: HTTP client for API requests
- `cheerio`: HTML parsing for web scraping (Zimaboard script)

## File Structure

```
scripts/data/
├── utils/
│   └── common.js              # Shared utilities
├── test/
│   └── scripts.test.js        # Test suite
├── get-*.js                   # Individual data scripts
├── run-all.js                 # Master script
├── package.json               # NPM configuration
└── README.md                  # This file
```

## Output Directory

All JSON files are saved to: `research/fetched-data/`

This directory is automatically created if it doesn't exist.

## Contributing

When adding new data scripts:

1. Follow the existing pattern using `utils/common.js`
2. Add the script to the `SCRIPTS` array in `run-all.js`
3. Add corresponding NPM script to `package.json`
4. Update tests in `test/scripts.test.js`
5. Document the new script in this README
