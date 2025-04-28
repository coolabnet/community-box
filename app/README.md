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
