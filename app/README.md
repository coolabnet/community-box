# Community Box App

A multilingual web application that helps communities discover the best technology setup for their digital infrastructure needs.

## Overview

The Community Box App guides users through a series of questions about their community's needs, resources, and technical capabilities. Based on their responses, the app provides personalized recommendations for hardware and software solutions that best fit their specific context.

## Features

- **Multilingual Support**: Available in English, Spanish, and Portuguese
- **Interactive Questionnaire**: Simple, user-friendly survey to gather community needs
- **Personalized Recommendations**: Tailored hardware and software suggestions based on responses
- **Detailed Comparisons**: Pros and cons of each recommended solution
- **Export Options**: Download or share recommendations as PDF or text
- **Persistent State**: Survey progress is saved in URL parameters and localStorage
- **Responsive Design**: Works on mobile and desktop devices

## Technology Stack

- React with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Framer Motion for animations
- react-i18next for internationalization
- jsPDF and html2canvas for PDF generation
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/luandro/community-box.git
   cd community-box
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Internationalization

The app supports multiple languages through the i18n system:

- English (default)
- Spanish
- Portuguese

Translation files are located in `src/i18n/locales/`.

To add a new language:

1. Create a new translation file in the locales directory
2. Add the language to the language switcher in `src/components/LanguageSwitcher.tsx`

### Translated research docs

Served docs (English source in `research/`) are translated into Portuguese and Spanish by `scripts/translate-docs.mjs`:

- Output: `research/i18n/<lang>/<path>.md` (for example `research/i18n/pt/guides/router-selection-guide.md`), plus a generated `_titles.json` per language.
- Served docs are listed in `research/i18n/manifest.json`. Add new docs there.
- If a translation is missing, the page shows the English text with a notice ("This page is not yet translated; showing English.").
- Env vars: `DEEPSEEK_API_KEY` or `ZAI_API_KEY` (one is required). Optional `DOCS_TRANSLATE_MODEL` overrides the model. Keys are never logged.
- Files with an unchanged `sourceHash` are skipped. The hash is the first 16 hex chars of the SHA-256 of the English file.
- Fenced blocks with a language tag (`bash`, `yaml`, …) stay byte-identical to English. Untagged fences (or `text`/`txt`/`plaintext`) hold natural-language instructions: after the body translation their inner content is translated in separate batched requests. Technical lines are never sent to the model — they are replaced by `@@LINE_n@@` placeholders and restored verbatim. A line is technical by default; it is translatable prose only when it starts (after indentation and an optional list marker or number) with an uppercase letter or is a `Label: value` line with an uppercase letter in the label, contains no shell metacharacters or path-like tokens (`| > < $ \` ; & =`, `/path`, `./`, `~/`), and its first word is not all lowercase — so commands beyond any allowlist (`nmcli connection up community`, `sudo …`, `ip addr`) stay technical. Translated fences must preserve line count, indentation, fences, URLs and the per-line order of technical tokens — whole technical lines (commands, executable paths like `/etc/init.d/dnsmasq restart`, UCI `config`/`option`/`list` statements, `KEY=value` and lowercase `key: value` config pairs, hosts-file entries, shell prompt lines) must stay byte-identical, as must paths, IP addresses, CLI flags, quoted labels, key names like F2/Del and numbers with units — blocks failing validation stay in English, and blocks that are mostly technical are kept in English without being sent for translation. Firmware/BIOS menu paths (Title-Case words joined by `→`, `->`, `>` or `»`, e.g. `Advanced → Security → Passwords`), quoted on-screen labels (e.g. `"Flash from file"`) and firmware setting values (`Enabled`, `Disabled`, `Auto`, `On`/`Off`, `Power On`, …) stay in English, and each setting's value is validated on its own line (`Enhanced Intel SpeedStep: Enabled` may not drift to `Disabled` because `Turbo Mode: Enabled` still holds the word); a translation in parentheses after the English label is allowed.
- Provider response bodies only reach logs and errors redacted (the API key becomes `***`) and capped at 200 characters.
- Redo one file: `npm run translate:docs -- --force --only guides/router-selection-guide`.
- Other flags: `--lang pt,es`, `--batch N/M`, `--concurrency 1-8`, `--provider deepseek|zai`.
- Run logs go to `app/logs/translate-docs-<lang>.log`.

Preview the plan without API calls:

```
$ cd app && node scripts/translate-docs.mjs --dry-run
SKIP pt about (up-to-date)
TRANSLATE pt guides/deployment-best-practices (missing)
TRANSLATE pt guides/disk-partitioning (missing)
TRANSLATE pt guides/dns-configuration (missing)
...
SKIP es software/yunohost/README (up-to-date)
dry-run: would translate 35, skip 33, of 68 tasks
```

Check the result with `npm run check:i18n`. Besides the doc structure, the check compares each translation's own fenced blocks with the English source: tagged blocks must be byte-identical, untagged ones must keep the source line count, per-line leading indentation, whole technical lines, technical tokens, per-line firmware setting values, and English firmware/BIOS menu paths.

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### GitHub Pages

This app is configured for automatic deployment to GitHub Pages using GitHub Actions. The workflow is defined in `.github/workflows/deploy.yml`.

When changes are pushed to the main branch, the app is automatically built and deployed to GitHub Pages. The live version can be accessed at:

```
https://[username].github.io/community-box/
```

The Vite configuration has been set up to handle the base path for GitHub Pages deployment automatically in production builds.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created to support community networks and local digital infrastructure initiatives
- Special thanks to all contributors and community partners who provided feedback and testing
