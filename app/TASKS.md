# Tasks

## Architecture and Design

- [ ] **Refactor `RecommendationResults.tsx`**
  - **Difficulty:** Hard
  - **Description:** `src/components/RecommendationResults.tsx` is over 1000 lines long, handling UI layout, complex state, static data definitions (devices), and ties into PDF generation.
  - **Action Items:** 
    - Refactor into smaller sub-components (e.g., `DeviceCard.tsx`, `OSRecommendation.tsx`).
    - Move the `devices` static array into a dedicated configuration file in `src/data/` or `src/utils/`.
- [ ] **Extract Hardcoded Data**
  - **Difficulty:** Medium
  - **Description:** Device attributes, services, and operating systems are hardcoded directly into the frontend code rather than being fetched from an API or an external JSON configuration.
  - **Action Items:** 
    - Extract this data into a `config.json` file or serve it from a lightweight backend/CMS.

## Potential Bugs

- [x] **Fix Brittle OS Hardware Fallback**
  - **Difficulty:** Easy
  - **Description:** In `src/utils/recommendations.ts` (lines 159-161), the `getOSSuggestions` function falls back to returning all OSes for a use-case if none match the specific hardware. This could result in recommending an incompatible operating system for the user's selected hardware.
  - **Action Items:** 
    - Update the fallback logic. Return an empty array or a specific "No compatible OS found" state, rather than blindly falling back to potentially incompatible options.
- [x] **Fix Environment Routing Assumption**
  - **Difficulty:** Easy
  - **Description:** In `src/App.tsx` (line 18), the `basename` is hardcoded to `'/community-box'` for production: `import.meta.env.MODE === 'production' ? '/community-box' : ''`. If deployed to a custom domain instead of GitHub pages, routing will break.
  - **Action Items:** 
    - Read the basename from a dedicated environment variable (e.g., `VITE_ROUTER_BASENAME`) rather than coupling it strictly to the production environment mode.

## Maintainability Concerns

- [x] **Fix Empty Translation Fields**
  - **Difficulty:** Easy
  - **Description:** In `src/utils/recommendations.ts`, the static objects for `services` and `operatingSystems` have empty strings for their names and descriptions (e.g., `name: '', description: ''`). If a translation is missing, the UI will render blank text.
  - **Action Items:** 
    - Either store the actual i18n translation key string here (e.g., `name: 'services.nextcloud.name'`) or provide an English fallback string.

## Code Quality Issues

- [x] **Improve Fragile Type Casting**
  - **Difficulty:** Easy
  - **Description:** In `src/utils/recommendations.ts` (line 182), the type casting for the usage parameter is weak: `const typedUsage = usage && typeof usage === 'object' ? usage as UsageSelectionValues : undefined;`. This assumes any object passed is a valid `UsageSelectionValues` object.
  - **Action Items:** 
    - Create a Zod schema for `UsageSelectionValues` and validate the object, or write a proper TypeScript type guard function.

## Performance Issues

- [ ] **Optimize Context Re-renders in Questionnaire**
  - **Difficulty:** Medium
  - **Description:** In `src/components/Questionnaire.tsx`, the component consumes the `useQuestionnaire` context to manage the active step and all form answers. Every time a user updates a single input, the entire context state updates, causing the whole component and child components to re-render.
  - **Action Items:** 
    - Split the context into `QuestionnaireStateContext` and `QuestionnaireDispatchContext`, or use a more optimized state manager like `zustand` to prevent unnecessary re-renders.

## Missing Functionality

- [ ] **Implement Form Validation**
  - **Difficulty:** Medium
  - **Description:** There is no strict validation preventing a user from clicking "Next" before providing a valid answer in the `Questionnaire.tsx` steps.
  - **Action Items:** 
    - Disable the "Next" button on `QuestionCard` components until `selectedValue` is truthy, or integrate `react-hook-form` and `zod` to manage the questionnaire steps with built-in validation.
