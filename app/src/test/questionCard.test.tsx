import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import en from '@/i18n/locales/en.json';
import QuestionCard from '@/components/QuestionCard';

const i18n = i18next.createInstance();
void i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});

const render = (selectedValue?: string) =>
  renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <QuestionCard
        question="Is there someone who can help?"
        type="options"
        options={[
          { label: 'Community', value: 'community' },
          { label: 'Not yet', value: 'no' },
        ]}
        selectedValue={selectedValue}
        onNext={() => {}}
      />
    </I18nextProvider>
  );

describe('QuestionCard option selection state', () => {
  it('exposes the selected option to assistive technology', () => {
    const html = render('no');

    expect(html).toMatch(/aria-pressed="false"[^>]*>Community</);
    expect(html).toMatch(/aria-pressed="true"[^>]*><svg[^>]*aria-hidden="true"[^>]*>.*<\/svg>Not yet</);
  });

  it('marks no option pressed before a choice', () => {
    expect(render()).not.toContain('aria-pressed="true"');
  });
});
