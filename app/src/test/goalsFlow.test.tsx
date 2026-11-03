import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import en from '@/i18n/locales/en.json';
import GoalSelection from '@/components/GoalSelection';
import ApplicationsReview from '@/components/ApplicationsReview';
import {
  getAppOptionsByGoal,
  resolveSelectedApps,
  toggleAppSelection,
} from '@/utils/applications';
import { migrateAnswers } from '@/utils/statePersistence';
import { getResultApplications } from '@/utils/resultApplications';
import { needsGoalsFirst } from '@/utils/questionnaireFlow';
import { sanitizeGoals } from '@/utils/statePersistence';
import PDFTemplate from '@/components/PDFTemplate';
import { normalizeUserAnswers, calculateDeviceScores } from '@/utils/deviceScoring';
import { getRecommendations } from '@/utils/recommendations';
import type { GoalSelectionValues, UserAnswers } from '@/types/questionnaire';

const i18n = i18next.createInstance();
void i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});

const wrap = (node: React.ReactElement) =>
  renderToStaticMarkup(<I18nextProvider i18n={i18n}>{node}</I18nextProvider>);

// Returns the aria-pressed value of the toggle button whose text contains `name`.
const pressedOf = (html: string, name: string): string | null => {
  const buttons: string[] = html.match(/<button[^>]*aria-pressed="[^"]*"[^>]*>[\s\S]*?<\/button>/g) ?? [];
  const match = buttons.find(b => b.includes(`>${name}<`));
  return match?.match(/aria-pressed="([^"]*)"/)?.[1] ?? null;
};

const appName = (id: string): string => {
  const entry = getAppOptionsByGoal({ education: true, mediaStorage: true })
    .flatMap(g => g.options)
    .find(o => o.app.id === id);
  if (!entry) throw new Error(`app ${id} not in test goals`);
  return i18n.t(`${entry.app.i18nKey}.name`);
};

describe('GoalSelection', () => {
  it('renders 11 toggle options and no Back button on step 0', () => {
    const html = wrap(<GoalSelection onNext={() => {}} />);

    expect(html.match(/aria-pressed="false"/g)).toHaveLength(11);
    expect(html).not.toContain('Back');
  });

  it('preselects initial values and keeps the other input outside the button', () => {
    const html = wrap(
      <GoalSelection initialValues={{ education: true, other: 'radio' }} onNext={() => {}} />
    );

    expect(html.match(/aria-pressed="true"/g)).toHaveLength(2);
    expect(html).toContain('value="radio"');
    expect(html).not.toMatch(/<button[^>]*>(?:(?!<\/button>)[\s\S])*<input/);
  });
});

describe('ApplicationsReview', () => {
  const goals: GoalSelectionValues = { mediaStorage: true };
  const options = getAppOptionsByGoal(goals)[0].options;
  const defaultApp = options.find(o => o.isDefault)!.app;
  const otherApp = options.find(o => !o.isDefault)!.app;

  it('enables defaults and leaves other apps off', () => {
    const html = wrap(<ApplicationsReview goals={goals} onNext={() => {}} />);

    expect(pressedOf(html, i18n.t(`${defaultApp.i18nKey}.name`))).toBe('true');
    expect(pressedOf(html, i18n.t(`${otherApp.i18nKey}.name`))).toBe('false');
  });

  it('flips apps according to saved choices', () => {
    const html = wrap(
      <ApplicationsReview
        goals={goals}
        initialValues={{ selected: [otherApp.id], dismissed: [defaultApp.id] }}
        onNext={() => {}}
      />
    );

    expect(pressedOf(html, i18n.t(`${defaultApp.i18nKey}.name`))).toBe('false');
    expect(pressedOf(html, i18n.t(`${otherApp.i18nKey}.name`))).toBe('true');
  });

  it('turns all education defaults on', () => {
    const html = wrap(<ApplicationsReview goals={{ education: true }} onNext={() => {}} />);

    expect(pressedOf(html, appName('kolibri'))).toBe('true');
  });

  it('shows an empty state for a goal without apps', () => {
    const html = wrap(<ApplicationsReview goals={{ healthWellbeing: true }} onNext={() => {}} />);

    expect(html).toContain('No applications researched for this goal yet.');
  });

  it('explains that free text yields no apps', () => {
    const html = wrap(<ApplicationsReview goals={{ other: 'radio' }} onNext={() => {}} />);

    expect(html).toContain('We cannot suggest applications from free text.');
  });
});

describe('resolveSelectedApps', () => {
  const goals: GoalSelectionValues = { mediaStorage: true };
  const options = getAppOptionsByGoal(goals)[0].options;
  const defaultIds = options.filter(o => o.isDefault).map(o => o.app.id);
  const extraId = options.find(o => !o.isDefault)!.app.id;
  const ids = (list: { id: string }[]) => list.map(a => a.id);

  it('returns the defaults without a selection', () => {
    expect(ids(resolveSelectedApps(goals)).sort()).toEqual([...defaultIds].sort());
  });

  it('removes dismissed defaults', () => {
    const result = ids(resolveSelectedApps(goals, { selected: [], dismissed: [defaultIds[0]] }));
    expect(result).not.toContain(defaultIds[0]);
  });

  it('adds selected apps', () => {
    expect(ids(resolveSelectedApps(goals, { selected: [extraId], dismissed: [] }))).toContain(extraId);
  });

  it('ignores unknown ids', () => {
    const result = resolveSelectedApps(goals, { selected: ['nope'], dismissed: ['nope2'] });
    expect(ids(result).sort()).toEqual([...defaultIds].sort());
  });

  it('drops a selected app whose goal is no longer chosen', () => {
    const result = resolveSelectedApps({ education: true }, { selected: [extraId], dismissed: [] });
    expect(ids(result)).not.toContain(extraId);
  });

  it('lists an app shared by two goals once', () => {
    const result = ids(resolveSelectedApps({ mediaStorage: true, officeCollab: true }));
    expect(result.filter(id => id === 'nextcloud')).toHaveLength(1);
  });

  it('returns nothing for free-text-only goals', () => {
    expect(resolveSelectedApps({ other: 'radio' })).toEqual([]);
  });
});

describe('toggleAppSelection', () => {
  const defaults = ['a', 'b'];
  const empty = { selected: [], dismissed: [] };

  it('records a turned-off default as dismissed and restores it', () => {
    const off = toggleAppSelection(empty, 'a', defaults);
    expect(off).toEqual({ selected: [], dismissed: ['a'] });

    expect(toggleAppSelection(off, 'a', defaults)).toEqual(empty);
  });

  it('records a turned-on non-default as selected and restores it', () => {
    const on = toggleAppSelection(empty, 'z', defaults);
    expect(on).toEqual({ selected: ['z'], dismissed: [] });

    expect(toggleAppSelection(on, 'z', defaults)).toEqual(empty);
  });

  it('never puts an id in both lists', () => {
    let state = toggleAppSelection(empty, 'a', defaults);
    state = toggleAppSelection(state, 'z', defaults);
    state = toggleAppSelection(state, 'a', defaults);
    state = toggleAppSelection(state, 'a', defaults);

    expect(state.selected.filter(id => state.dismissed.includes(id))).toEqual([]);
  });
});

describe('migrateAnswers strict guard', () => {
  it.each([
    ['empty object', {}],
    ['array', []],
    ['string flag', { news: 'yes' }],
    ['blank other', { other: '  ' }],
  ])('sets no goals for %s', (_name, usage) => {
    const migrated = migrateAnswers({ usage }, 2);
    expect(migrated.goals).toBeUndefined();
  });

  it('keeps existing goals and skips current-version state', () => {
    expect(migrateAnswers({ usage: { news: true }, goals: { education: true } }, 2).goals).toEqual({
      education: true,
    });
    expect(migrateAnswers({ usage: { news: true } }, 3).goals).toBeUndefined();
  });
});

describe('getResultApplications', () => {
  it('uses resolved apps when goals and reviewed apps are present', () => {
    const answers: UserAnswers = { goals: { education: true }, apps: { selected: [], dismissed: [] } };
    const ids = getResultApplications(answers).map(a => a.id);

    expect(ids.sort()).toEqual(resolveSelectedApps({ education: true }).map(a => a.id).sort());
  });

  it('keeps the legacy list when goals exist but apps were never reviewed', () => {
    const answers: UserAnswers = {
      usage: { news: true },
      goals: { localMedia: true },
      mainUse: 'education',
      format: 'yes',
    };
    const legacy = getRecommendations(answers.usage, answers.mainUse, answers.format).services;

    expect(getResultApplications(answers).map(a => a.id)).toEqual(legacy.map(s => s.key));
  });

  it('uses the legacy list without goals', () => {
    const answers: UserAnswers = { usage: { files: true }, mainUse: 'education', format: 'yes' };
    const legacy = getRecommendations(answers.usage, answers.mainUse, answers.format).services;
    const result = getResultApplications(answers);

    expect(result.map(a => a.id)).toEqual(legacy.map(s => s.key));
    expect(result[0].i18nKey).toBe(`questionnaire.questions.results.services.items.${legacy[0].key}`);
  });
});

describe('needsGoalsFirst', () => {
  it('asks for goals only on the applications step without goals', () => {
    expect(needsGoalsFirst('applications', {})).toBe(true);
    expect(needsGoalsFirst('applications', { goals: { education: true } })).toBe(false);
    expect(needsGoalsFirst('mainUse', {})).toBe(false);
    expect(needsGoalsFirst('goals', {})).toBe(false);
  });
});

describe('getAppOptionsByGoal ranking', () => {
  it('ranks a multi-goal app above single-goal apps within a section', () => {
    const sections = getAppOptionsByGoal({ mediaStorage: true, officeCollab: true });
    const media = sections.find(s => s.goal === 'mediaStorage')!;

    expect(media.options[0].app.id).toBe('nextcloud');
  });
});

describe('sanitizeGoals conflicts', () => {
  it('lets an alias and its target both map to one goal', () => {
    expect(sanitizeGoals({ old: true, education: true }, { old: 'education' })).toEqual({
      education: true,
    });
  });
});

describe('PDFTemplate goals', () => {
  it('prints goal names and the other text, not raw JSON', () => {
    const answers: UserAnswers = {
      goals: { education: true, other: 'radio' },
      apps: { selected: ['kolibri'], dismissed: [] },
    };
    const scores = calculateDeviceScores(answers, normalizeUserAnswers(answers));
    const html = wrap(
      <PDFTemplate recommendation={scores[0]} alternatives={scores.slice(1)} answers={answers} />
    );

    expect(html).toContain('Learning and schools');
    expect(html).toContain('Something else: radio');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('&quot;selected&quot;');
  });

  it('prints the original usage answer for unreviewed migrated goals', () => {
    const answers: UserAnswers = {
      usage: { media: true },
      goals: { mediaStorage: true, localMedia: true },
    };
    const scores = calculateDeviceScores(answers, normalizeUserAnswers(answers));
    const html = wrap(
      <PDFTemplate recommendation={scores[0]} alternatives={scores.slice(1)} answers={answers} />
    );

    expect(html).not.toContain('Local news, radio and portal');
    expect(html).toContain(en.questionnaire.questions.usage.question);
  });
});
