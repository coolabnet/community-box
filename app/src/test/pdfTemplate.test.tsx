import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import en from '@/i18n/locales/en.json';
import pt from '@/i18n/locales/pt.json';
import es from '@/i18n/locales/es.json';
import catalog from '@/data/applications/applications.json';
import PDFTemplate from '@/components/PDFTemplate';
import { buildRecommendation } from '@/utils/recommendationPipeline';
import type { Capacity } from '@/utils/applications';
import type { ResultApplication } from '@/utils/resultApplications';
import type { DeviceKey, DeviceScore, UserAnswers } from '@/types/questionnaire';

const i18n = i18next.createInstance();
void i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});

const wrap = (node: React.ReactElement, instance: i18next.i18n = i18n) =>
  renderToStaticMarkup(<I18nextProvider i18n={instance}>{node}</I18nextProvider>);

const goalsAnswers = (goals: UserAnswers['goals'], over: Partial<UserAnswers> = {}): UserAnswers => ({
  goals,
  apps: { selected: [], dismissed: [] },
  ...over,
});

// Goals-flow render helper: persona answers + full recommendation output.
// Unverified caveats stay off unless explicitly requested.
const renderGoals = (
  answers: UserAnswers,
  options: {
    applications?: ResultApplication[];
    alternatives?: DeviceScore[];
    includeUnverifiedCaveats?: boolean;
  } = {}
) => {
  const result = buildRecommendation(answers);
  const html = wrap(
    <PDFTemplate
      recommendation={result.deviceScores[0]}
      alternatives={options.alternatives ?? result.deviceScores.slice(1, 3)}
      answers={answers}
      applications={options.applications ?? result.applications}
      capacity={result.capacity}
      unverifiedApps={options.includeUnverifiedCaveats ? result.unverified : undefined}
      osPlatformsIncomplete={options.includeUnverifiedCaveats ? result.osPlatformsIncomplete : undefined}
    />
  );
  return { result, html };
};

// The applications section spans from its wrapper class to the answers summary.
const applicationsSection = (html: string): string => {
  const start = html.indexOf('pdf-applications');
  const end = html.indexOf('pdf-answers');
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return html.slice(start, end);
};

describe('PDFTemplate applications section', () => {
  it('renders the services heading, app names and one data-pdf-block per app', () => {
    const { result, html } = renderGoals(goalsAnswers({ mediaStorage: true }, { users: '6+' }));

    expect(result.applications.map(a => a.id).sort()).toEqual(
      ['filebrowser-quantum', 'jellyfin', 'nextcloud']
    );
    expect(html).toContain(i18n.t('questionnaire.questions.results.services.title'));
    for (const app of result.applications) {
      expect(html).toContain(i18n.t(`${app.i18nKey}.name`));
    }
    const section = applicationsSection(html);
    // 3 blocks: the heading+first-card wrapper plus one per remaining card.
    expect(section.match(/data-pdf-block/g)).toHaveLength(3);
  });

  it('keeps the heading and the first app card inside one data-pdf-block', () => {
    const { result, html } = renderGoals(goalsAnswers({ mediaStorage: true }, { users: '6+' }));
    const section = applicationsSection(html);
    const title = i18n.t('questionnaire.questions.results.services.title');
    const firstName = i18n.t(`${result.applications[0].i18nKey}.name`);
    const idxTitle = section.indexOf(title);
    const idxName = section.indexOf(firstName);
    expect(idxTitle).toBeGreaterThanOrEqual(0);
    expect(idxName).toBeGreaterThan(idxTitle);

    // Depth-walk divs from the wrapper's open tag to its MATCHING </div>: the
    // heading and the first card's name must both sit inside that element.
    // Mere string order cannot prove containment — if the card moved outside
    // the wrapper, the wrapper would close right after the heading and the
    // name would land beyond wrapperClose.
    const wrapperOpen = section.indexOf('<div data-pdf-block');
    expect(wrapperOpen).toBeGreaterThanOrEqual(0);
    expect(wrapperOpen).toBeLessThan(idxTitle);

    const divTag = /<div\b[^>]*>|<\/div>/g;
    divTag.lastIndex = wrapperOpen;
    let depth = 0;
    let wrapperClose = -1;
    for (let m = divTag.exec(section); m; m = divTag.exec(section)) {
      depth += m[0] === '</div>' ? -1 : 1;
      if (depth === 0) {
        wrapperClose = m.index;
        break;
      }
    }
    expect(wrapperClose).toBeGreaterThan(wrapperOpen);
    expect(idxTitle).toBeLessThan(wrapperClose);
    expect(idxName).toBeGreaterThan(wrapperOpen);
    expect(idxName).toBeLessThan(wrapperClose);
  });

  it('renders evidence URLs as plain text with checked-on dates, never anchors', () => {
    const { html } = renderGoals(goalsAnswers({ mediaStorage: true }, { users: '6+' }));
    const filebrowser = catalog.find(a => a.id === 'filebrowser-quantum');
    expect(filebrowser?.evidence?.length).toBeGreaterThan(0);

    for (const ev of filebrowser!.evidence!) {
      const withDate = `${ev.url} (checked on 2026-11-02)`;
      expect(html).toContain(withDate);
      // Every occurrence of the URL is the dated one.
      expect(html.split(ev.url).length - 1).toBe(html.split(withDate).length - 1);
    }
    expect(applicationsSection(html)).not.toContain('<a ');
  });
});

describe('PDFTemplate capacity block', () => {
  it('interpolates the documented-confidence summary and the heuristic note', () => {
    const { result, html } = renderGoals(
      goalsAnswers({
        mediaStorage: true,
      }, {
        // Only filebrowser-quantum stays: it documents its RAM, so confidence
        // is documented (the other mediaStorage defaults document nothing).
        apps: { selected: ['filebrowser-quantum'], dismissed: ['jellyfin', 'nextcloud'] },
      })
    );
    expect(result.capacity?.confidence).toBe('documented');

    expect(html).toContain(
      i18n.t('questionnaire.questions.results.capacity.summary', {
        minRamGb: result.capacity!.minRamGb,
        recommendedRamGb: result.capacity!.recommendedRamGb,
      })
    );
    expect(html).toContain(i18n.t('questionnaire.questions.results.capacity.heuristicNote'));
  });

  it('branches on confidence and only prints storage when it is known', () => {
    // (a) unknown confidence: hedged summary only.
    const media = renderGoals(goalsAnswers({ mediaStorage: true }, { users: '6+' }));
    expect(media.result.capacity?.confidence).toBe('unknown');
    expect(media.html).toContain(
      i18n.t('questionnaire.questions.results.capacity.summaryUnknown', {
        minRamGb: media.result.capacity!.minRamGb,
      })
    );
    expect(media.html).not.toContain(
      i18n.t('questionnaire.questions.results.capacity.summary', {
        minRamGb: media.result.capacity!.minRamGb,
        recommendedRamGb: media.result.capacity!.recommendedRamGb,
      })
    );

    // (b) network management: pihole storage is counted.
    const network = renderGoals(goalsAnswers({ networkManagement: true }));
    expect(network.result.capacity!.minStorageGb).toBeGreaterThanOrEqual(2);
    expect(network.html).toContain(
      i18n.t('questionnaire.questions.results.capacity.storage', {
        minStorageGb: network.result.capacity!.minStorageGb,
      })
    );

    // (c) education: no storage documented, no storage line.
    const education = renderGoals(goalsAnswers({ education: true }));
    expect(education.result.capacity?.minStorageGb).toBe(0);
    expect(education.html).not.toContain(
      i18n.t('questionnaire.questions.results.capacity.storage', {
        minStorageGb: education.result.capacity!.minStorageGb,
      })
    );
  });
});

describe('PDFTemplate fit lines', () => {
  const answers = goalsAnswers({ mediaStorage: true }, { users: '6+' });
  const result = buildRecommendation(answers);
  // Synthetic scores isolate the fit-line rendering from the persona's own
  // fit reasons. Top and alternative use DIFFERENT device keys so cardSlice
  // resolves each card unambiguously (the persona's top score is zimaBoard).
  const topScore: DeviceScore = {
    ...result.deviceScores[0],
    fit: 'ok',
    fitReasons: ['belowRecommendedRam', 'chooseRamVariant'],
    suggestedRamGb: 4,
  };
  const altScore: DeviceScore = {
    ...result.deviceScores.find(s => s.device.key === 'intelNUC'),
    fitReasons: ['belowRecommendedRam'],
  };
  // cardSlice needs two distinct cards: sanity-check keys inside each test.
  const assertDistinctCards = () => {
    expect(altScore.device).toBeDefined();
    expect(topScore.device.key).not.toBe(altScore.device.key);
  };

  // Slice one device card: from its name heading to the next card/section marker.
  const cardSlice = (html: string, deviceKey: DeviceKey): string => {
    const heading = (key: DeviceKey) =>
      `>${i18n.t(`questionnaire.questions.results.devices.${key}.name`)}<`;
    const start = html.indexOf(heading(deviceKey));
    expect(start).toBeGreaterThanOrEqual(0);
    const rest = html.slice(start + 1);
    const markers = [
      ...result.deviceScores.map(s => heading(s.device.key)),
      'pdf-capacity',
      'pdf-applications',
      'pdf-answers',
    ].filter(m => m !== heading(deviceKey));
    const ends = markers.map(m => rest.indexOf(m)).filter(i => i >= 0);
    return rest.slice(0, ends.length ? Math.min(...ends) : undefined);
  };

  it('prints every fit reason under documented confidence', () => {
    assertDistinctCards();
    const documented: Capacity = {
      minRamGb: 2,
      recommendedRamGb: 4,
      minStorageGb: 0,
      architectures: [],
      confidence: 'documented',
    };
    const html = wrap(
      <PDFTemplate
        recommendation={topScore}
        alternatives={[altScore]}
        answers={answers}
        capacity={documented}
      />
    );

    const top = cardSlice(html, topScore.device.key);
    const alt = cardSlice(html, altScore.device.key);
    expect(top).toContain('Less RAM than we recommend.');
    expect(top).toContain('Choose 4 GB of RAM for this computer.');
    expect(alt).toContain('Less RAM than we recommend.');
  });

  it('hedges the variant hint and hides belowRecommendedRam under unknown confidence', () => {
    assertDistinctCards();
    const html = wrap(
      <PDFTemplate
        recommendation={topScore}
        alternatives={[altScore]}
        answers={answers}
        capacity={result.capacity}
      />
    );

    const top = cardSlice(html, topScore.device.key);
    const alt = cardSlice(html, altScore.device.key);
    expect(top).not.toContain('Less RAM than we recommend.');
    expect(alt).not.toContain('Less RAM than we recommend.');
    expect(top).toContain('Consider 4 GB of RAM for this computer.');
    expect(html).not.toContain('Choose 4 GB of RAM for this computer.');
  });
});

describe('PDFTemplate legacy back-compat', () => {
  it('renders exactly as before without applications and capacity props', () => {
    const answers: UserAnswers = { usage: { files: true }, mainUse: 'education', format: 'yes' };
    const result = buildRecommendation(answers);
    const html = wrap(
      <PDFTemplate
        recommendation={result.deviceScores[0]}
        alternatives={result.deviceScores.slice(1, 3)}
        answers={answers}
      />
    );

    expect(html).not.toContain('pdf-capacity');
    expect(html).not.toContain('pdf-applications');
    expect(html).not.toContain('GB of RAM for this computer');
    expect(html).not.toContain('Less RAM than we recommend.');
    expect(html).toContain(i18n.t('common.yourAnswersSummary'));

    // By construction: legacy suggestions passed without capacity still render
    // no applications section, even if the call-site gate were ever removed.
    const withLegacyApps = wrap(
      <PDFTemplate
        recommendation={result.deviceScores[0]}
        alternatives={result.deviceScores.slice(1, 3)}
        answers={answers}
        applications={result.applications}
      />
    );
    expect(withLegacyApps).not.toContain('pdf-capacity');
    expect(withLegacyApps).not.toContain('pdf-applications');
  });
});

describe('PDFTemplate links fallback', () => {
  it('prints links without a checked-on note and nothing when neither exists', () => {
    const answers = goalsAnswers({ mediaStorage: true }, { users: '6+' });
    const result = buildRecommendation(answers);
    const evidenceLabel = i18n.t('questionnaire.questions.results.pdf.evidenceLabel');
    const apps: ResultApplication[] = [
      {
        id: 'with-links',
        i18nKey: result.applications[0]!.i18nKey,
        icon: 'x',
        links: [{ kind: 'website', url: 'https://example.org/x' }],
      },
      { id: 'no-links', i18nKey: result.applications[1]!.i18nKey, icon: 'x' },
    ];

    const html = wrap(
      <PDFTemplate
        recommendation={result.deviceScores[0]}
        alternatives={result.deviceScores.slice(1, 3)}
        answers={answers}
        applications={apps}
        capacity={result.capacity}
      />
    );

    expect(html).toContain('https://example.org/x');
    expect(html).not.toContain('checked on');
    expect(html).toContain(i18n.t(`${apps[1]!.i18nKey}.name`));
    // Exactly one evidence block: the links app has one, the bare app none.
    expect(html.split(evidenceLabel).length - 1).toBe(1);
  });
});

describe('PDFTemplate unverified caveats', () => {
  it('lists unverified apps and the platforms caveat inside the applications section', () => {
    const { result, html } = renderGoals(goalsAnswers({ education: true }), {
      includeUnverifiedCaveats: true,
    });
    expect(result.unverified.map(u => u.id)).toContain('moodle');
    expect(result.osPlatformsIncomplete).toBe(true);

    const section = applicationsSection(html);
    expect(section).toContain(i18n.t('questionnaire.questions.results.unverified.label'));
    expect(section).toContain(i18n.t('questionnaire.questions.results.unverified.platforms'));

    // Paragraph-level: the warning paragraph itself must carry the app names,
    // not just appear somewhere in the section.
    const label = i18n.t('questionnaire.questions.results.unverified.label');
    const labelIdx = section.indexOf(label);
    const paragraph = section.slice(labelIdx, section.indexOf('</p>', labelIdx));
    const moodle = result.unverified.find(u => u.id === 'moodle');
    expect(paragraph).toContain(i18n.t(`${moodle.i18nKey}.name`));
    expect(paragraph).toContain(
      result.unverified.map(u => i18n.t(`${u.i18nKey}.name`)).join(', ')
    );
  });

  it('prints no unverified line when every selected app is verified', () => {
    const { result, html } = renderGoals(
      goalsAnswers({ mediaStorage: true }, { users: '6+' }),
      { includeUnverifiedCaveats: true }
    );
    expect(result.unverified).toEqual([]);
    expect(html).not.toContain(i18n.t('questionnaire.questions.results.unverified.label'));
  });
});

describe('PDFTemplate locale parity', () => {
  const localeFiles: Record<string, Record<string, unknown>> = { en, pt, es };

  const keyPaths = (obj: unknown, prefix = ''): string[] =>
    typeof obj === 'object' && obj !== null
      ? Object.entries(obj).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
      : [prefix];

  const getPath = (obj: unknown, path: string): unknown =>
    path.split('.').reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], obj);

  const placeholders = (value: unknown): string =>
    typeof value === 'string' ? (value.match(/\{\{[^}]+\}\}/g) ?? []).sort().join(',') : '';

  for (const section of ['pdf', 'capacity']) {
    it(`keeps ${section} key sets and placeholders identical across en/pt/es`, () => {
      const base = getPath(localeFiles.en, `questionnaire.questions.results.${section}`);
      const basePlaceholders = new Map(keyPaths(base).map(p => [p, placeholders(getPath(base, p))]));
      for (const [loc, file] of Object.entries(localeFiles)) {
        const target = getPath(file, `questionnaire.questions.results.${section}`);
        expect(new Set(keyPaths(target))).toEqual(new Set(basePlaceholders.keys()));
        for (const p of keyPaths(target)) {
          expect(placeholders(getPath(target, p))).toBe(basePlaceholders.get(p));
        }
      }
    });
  }

  const capacity: Capacity = {
    minRamGb: 2,
    recommendedRamGb: 4,
    minStorageGb: 2,
    architectures: [],
    confidence: 'documented',
  };

  it('renders the capacity block translated in pt and es', () => {
    const answers = goalsAnswers({ mediaStorage: true }, { users: '6+' });
    const result = buildRecommendation(answers);
    const cases: { loc: string; file: typeof pt | typeof es; title: string }[] = [
      { loc: 'pt', file: pt, title: 'De quanta memória RAM e armazenamento você precisa' },
      { loc: 'es', file: es, title: 'Cuánta memoria RAM y almacenamiento necesita' },
    ];

    for (const { loc, file, title } of cases) {
      const instance = i18next.createInstance();
      void instance.init({
        lng: loc,
        fallbackLng: false,
        resources: { [loc]: { translation: file } },
        interpolation: { escapeValue: false },
      });
      const html = wrap(
        <PDFTemplate
          recommendation={result.deviceScores[0]}
          alternatives={result.deviceScores.slice(1, 3)}
          answers={answers}
          capacity={capacity}
        />,
        instance
      );

      expect(html).toContain(title);
      expect(html).not.toContain('questionnaire.questions.results.capacity.title');
      expect(html).not.toContain('{{');
    }
  });
});
