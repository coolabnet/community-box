import type { UserAnswers } from '@/types/questionnaire';

// A saved state can reach the applications step without goals (for example a
// version 2 state saved before the usage question). Ask for goals first.
export const needsGoalsFirst = (stepId: string, answers: UserAnswers): boolean =>
  stepId === 'applications' && !answers.goals;
