// Category and goal ids for the applications catalog.
// Every id below is a DRAFT: the canonical list is pending LocNet agreement (#57).
// Swapping the final taxonomy only touches this file, the `categories` arrays in
// applications.json and the `goals.*` locale keys.

export type CategoryStatus = 'draft' | 'agreed';

export interface CategoryDef {
  id: string;
  status: CategoryStatus;
}

// DRAFT pending LocNet taxonomy (#57)
export const CATEGORIES = [
  { id: 'education', status: 'draft' },
  { id: 'mediaStorage', status: 'draft' },
  { id: 'officeCollab', status: 'draft' },
  { id: 'localMedia', status: 'draft' },
  { id: 'communication', status: 'draft' },
  { id: 'networkManagement', status: 'draft' },
  { id: 'languageCulture', status: 'draft' },
  { id: 'territoryMapping', status: 'draft' },
  { id: 'healthWellbeing', status: 'draft' },
  { id: 'localEconomy', status: 'draft' },
] as const satisfies readonly CategoryDef[];

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_IDS: readonly CategoryId[] = CATEGORIES.map(c => c.id);

// Goals are 1:1 with categories for now. The indirection lets LocNet merge or split
// categories without changing goal ids that end up in saved URLs.
export type GoalKey = CategoryId;

// DRAFT pending LocNet taxonomy (#57)
export const GOALS: Record<GoalKey, CategoryId[]> = {
  education: ['education'],
  mediaStorage: ['mediaStorage'],
  officeCollab: ['officeCollab'],
  localMedia: ['localMedia'],
  communication: ['communication'],
  networkManagement: ['networkManagement'],
  languageCulture: ['languageCulture'],
  territoryMapping: ['territoryMapping'],
  healthWellbeing: ['healthWellbeing'],
  localEconomy: ['localEconomy'],
};

// Maps the legacy `usage` answer keys to goals. `other` is free text and stays as-is.
export const LEGACY_USAGE_TO_GOALS: Record<'news' | 'files' | 'education' | 'media' | 'other', GoalKey[]> = {
  news: ['localMedia'],
  files: ['mediaStorage'],
  education: ['education'],
  media: ['mediaStorage', 'localMedia'],
  other: [],
};

// Old goal id -> current goal id, so renamed goals still decode from saved URLs.
export const GOAL_ID_ALIASES: Record<string, GoalKey> = {};

// Categories without an application entry yet. Explicit so gaps stay visible.
export const EMPTY_CATEGORIES_PENDING_RESEARCH: readonly CategoryId[] = [
  'communication',
  'territoryMapping',
  'healthWellbeing',
  'localEconomy',
];
