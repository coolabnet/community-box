import { Fragment, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { tArray } from '@/lib/i18n-helpers';
import {
  Cpu,
  Zap,
  Users,
  TrendingUp,
  Recycle,
  WrenchIcon,
  DollarSign,
  Check,
  Newspaper,
  FileText,
  GraduationCap,
  Radio,
  MoreHorizontal
} from 'lucide-react';

// Import app logo
import appLogo from '../assets/logo.svg';

import type {
  AttributeKey,
  DeviceAttributes,
  DeviceScore,
  UsageKey,
  UserAnswers,
} from '@/types/questionnaire';
import type { Capacity } from '@/utils/applications';
import type { ResultApplication } from '@/utils/resultApplications';
import { visibleFitReasons } from '@/utils/recommendationPipeline';

interface PDFTemplateProps {
  recommendation: DeviceScore;
  alternatives: DeviceScore[];
  answers: UserAnswers;
  applications?: ResultApplication[];
  capacity?: Capacity;
  unverifiedApps?: ResultApplication[];
  osPlatformsIncomplete?: boolean;
}

// Map attribute keys to icons
const attributeIcons: Record<AttributeKey, ReactNode> = {
  energy: <Zap className="h-5 w-5" />,
  concurrency: <Users className="h-5 w-5" />,
  growth: <TrendingUp className="h-5 w-5" />,
  reusable: <Recycle className="h-5 w-5" />,
  formatEase: <WrenchIcon className="h-5 w-5" />,
  cost: <DollarSign className="h-5 w-5" />
};

// Map usage keys to icons
const usageIcons: Record<UsageKey, ReactNode> = {
  news: <Newspaper className="h-5 w-5" />,
  files: <FileText className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />,
  media: <Radio className="h-5 w-5" />,
  other: <MoreHorizontal className="h-5 w-5" />
};

// Function to get match rating text based on percentage
const getMatchRating = (percentage: number, t: TFunction): string => {
  if (percentage >= 90) return t('questionnaire.questions.results.perfectMatch');
  if (percentage >= 75) return t('questionnaire.questions.results.excellentMatch');
  if (percentage >= 60) return t('questionnaire.questions.results.goodMatch');
  return t('questionnaire.questions.results.fairMatch');
};

// Function to get human-readable answer text
const getAnswerText = (questionId: string, value: unknown, t: TFunction): string => {
  if (questionId === 'points') {
    return t('common.pointAllocation');
  }

  if (questionId === 'usage') {
    return t('common.usageSelection');
  }

  if (typeof value === 'string') {
    return t(`questionnaire.questions.${questionId}.options.${value}`);
  }

  return String(value);
};

const PDFTemplate = ({
  recommendation,
  alternatives,
  answers,
  applications,
  capacity,
  unverifiedApps,
  osPlatformsIncomplete,
}: PDFTemplateProps) => {
  const { t } = useTranslation();
  const pdfRef = useRef<HTMLDivElement>(null);

  // Get the top recommendation
  const topRecommendation = recommendation;
  // Goals inferred from a legacy usage answer were never reviewed: print the
  // original usage answer instead (same rule as utils/resultApplications.ts).
  const showGoals = !!answers.goals && (!!answers.apps || !answers.usage);

  // Capacity-fit lines for a device card, plain text (same rules as the
  // on-screen cards: visibleFitReasons drops belowRecommendedRam under unknown
  // confidence and the variant hint copy is hedged then).
  const renderPdfFitLines = (score: DeviceScore) => {
    const lines = visibleFitReasons(score, capacity).map(reason =>
      reason === 'chooseRamVariant'
        ? t(capacity?.confidence === 'unknown'
            ? 'questionnaire.questions.results.fit.chooseRamVariantEstimated'
            : 'questionnaire.questions.results.fit.chooseRamVariant',
            { ram: score.suggestedRamGb ?? '' })
        : t(`questionnaire.questions.results.fit.${reason}`)
    );
    if (lines.length === 0) return null;
    return (
      <div className="mt-2 space-y-1">
        {lines.map(text => <p key={text} className="text-sm text-gray-700">{text}</p>)}
      </div>
    );
  };

  // One application card: evidence URLs as plain text (canvas-rendered PDF,
  // links are not clickable), links only as a fallback when evidence is absent.
  // The first card omits its own data-pdf-block: the heading+card wrapper is
  // its paging block, so the pair stays atomic in the page slicer.
  const renderAppCard = (app: ResultApplication, withPagingBlock = true) => {
    const evidenceSources: { url: string; note?: string }[] = app.evidence?.length
      ? app.evidence.map(ev => ({
          url: ev.url,
          note: t('questionnaire.questions.results.pdf.checkedOn', { date: ev.checked }),
        }))
      : (app.links ?? []).map(l => ({ url: l.url }));
    return (
      <div data-pdf-block={withPagingBlock ? true : undefined} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{app.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800">{t(`${app.i18nKey}.name`)}</h4>
            <p className="text-sm text-gray-600 mb-1">{t(`${app.i18nKey}.description`)}</p>
            {(app.status === 'candidate' || app.offline === 'full' || app.network === 'needsInternet') && (
              <p className="text-sm text-gray-700 mb-1">
                {[
                  app.status === 'candidate' && t('questionnaire.questions.applications.badges.lessEvidence'),
                  app.offline === 'full' && t('questionnaire.questions.applications.badges.worksOffline'),
                  app.network === 'needsInternet' && t('questionnaire.questions.applications.badges.needsInternet'),
                ].filter(Boolean).join(' · ')}
              </p>
            )}
            {evidenceSources.length > 0 && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">{t('questionnaire.questions.results.pdf.evidenceLabel')}: </span>
                {evidenceSources.map(src => (
                  <p key={src.url} className="break-all">
                    {src.url}{src.note ? ` (${src.note})` : ''}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={pdfRef}
      className="pdf-container bg-white p-8 max-w-[210mm] mx-auto shadow-lg"
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        lineHeight: 1.5,
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Header with logo */}
      <div className="pdf-header flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div className="pdf-title">
          <h1 className="text-3xl font-bold text-primary mb-1">
            {t('questionnaire.questions.results.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('questionnaire.questions.results.subtitle')}
          </p>
        </div>
        <div className="pdf-logo">
          <img
            src={appLogo}
            alt={t('common.logoAlt')}
            className="h-16 w-auto"
            onError={(e) => {
              // Fallback if logo fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Top recommendation */}
      <div data-pdf-block className="pdf-recommendation mb-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-full">
              {topRecommendation.device.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.name`)}
              </h2>
              <p className="text-gray-600">
                {t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.description`)}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {topRecommendation.matchPercentage}%
            </div>
            <div className="text-sm font-medium text-gray-600">
              {getMatchRating(topRecommendation.matchPercentage, t)}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-4 text-gray-800">
          {t('questionnaire.questions.results.whyThisRecommendation')}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {topRecommendation.strengths.map((strength) => (
            <div
              key={strength}
              data-pdf-block
              className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg"
            >
              <div className="text-primary">
                {attributeIcons[strength]}
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {t(`questionnaire.questions.results.attributes.${strength}`)}
                </div>
                <div className="text-sm text-gray-600">
                  {t(`questionnaire.questions.results.reasonings.${strength}`)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <h4 className="font-medium mb-2 text-gray-800">{t('common.pros')}</h4>
            <ul className="space-y-1">
              {tArray(t, `questionnaire.questions.results.devices.${topRecommendation.device.key}.pros`).map((pro: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-2 text-gray-800">{t('common.cons')}</h4>
            <ul className="space-y-1">
              {tArray(t, `questionnaire.questions.results.devices.${topRecommendation.device.key}.cons`).map((con: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-4 w-4 text-gray-400 mt-1 shrink-0">-</span>
                  <span className="text-gray-600">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-pdf-block className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2 text-gray-800">{t('common.idealFor')}</h4>
          <p className="text-gray-700">{t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.idealFor`)}</p>
        </div>

        {renderPdfFitLines(topRecommendation)}
      </div>

      {/* Capacity summary (goals flow only; same copy as the on-screen block) */}
      {capacity && (
        <div data-pdf-block className="pdf-capacity mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {t('questionnaire.questions.results.capacity.title')}
          </h3>
          <p className="text-gray-700 mb-2">
            {capacity.confidence === 'unknown'
              ? t('questionnaire.questions.results.capacity.summaryUnknown', { minRamGb: capacity.minRamGb })
              : t('questionnaire.questions.results.capacity.summary', { minRamGb: capacity.minRamGb, recommendedRamGb: capacity.recommendedRamGb })}
          </p>
          {capacity.minStorageGb > 0 && (
            <p className="text-gray-700 mb-2">
              {t('questionnaire.questions.results.capacity.storage', { minStorageGb: capacity.minStorageGb })}
            </p>
          )}
          <p className="text-gray-700 mb-2">
            {t(`questionnaire.questions.results.capacity.confidence.${capacity.confidence}`)}
          </p>
          <p className="text-sm text-gray-600">{t('questionnaire.questions.results.capacity.heuristicNote')}</p>
        </div>
      )}

      {/* Alternative recommendations */}
      {alternatives.length > 0 && (
        <div className="pdf-alternatives mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {t('questionnaire.questions.results.viewAlternatives')}
          </h3>

          <div className="space-y-4">
            {alternatives.slice(0, 2).map((alternative) => (
              <div
                key={alternative.device.key}
                data-pdf-block
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 text-gray-700 rounded-full">
                      {alternative.device.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {t(`questionnaire.questions.results.devices.${alternative.device.key}.name`)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {getMatchRating(alternative.matchPercentage, t)} ({alternative.matchPercentage}%)
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">
                  {t(`questionnaire.questions.results.devices.${alternative.device.key}.description`)}
                </p>

                {renderPdfFitLines(alternative)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications (goals flow only): evidence URLs as plain text, never anchors.
          The heading and the first card share one data-pdf-block so the page
          slicer cannot orphan the heading above the first card. */}
      {capacity && applications && applications.length > 0 && (
        <div className="pdf-applications mb-8">
          <div data-pdf-block>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {t('questionnaire.questions.results.services.title')}
            </h3>
            <div className="space-y-4">{renderAppCard(applications[0], false)}</div>
          </div>
          {applications.length > 1 && (
            <div className="space-y-4 mt-4">
              {applications.slice(1).map(app => (
                <Fragment key={app.id}>{renderAppCard(app)}</Fragment>
              ))}
            </div>
          )}
          {unverifiedApps && unverifiedApps.length > 0 && (
            <p data-pdf-block className="text-sm text-gray-600 mb-2">
              {t('questionnaire.questions.results.unverified.label')}{' '}
              {unverifiedApps.map(u => t(`${u.i18nKey}.name`)).join(', ')}
            </p>
          )}
          {osPlatformsIncomplete && (
            <p data-pdf-block className="text-sm text-gray-600 mb-2">
              {t('questionnaire.questions.results.unverified.platforms')}
            </p>
          )}
        </div>
      )}

      {/* User answers summary */}
      <div className="pdf-answers mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {t('common.yourAnswersSummary')}
        </h3>

        <div className="space-y-4">
          {/* Basic questions */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(answers)
              .filter(([key]) => !['points', 'usage', 'accessDevices', 'goals', 'apps'].includes(key))
              .map(([key, value]) => (
                <div key={key} data-pdf-block className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-800 mb-1">
                    {t(`questionnaire.questions.${key}.question`)}
                  </div>
                  <div className="text-gray-700">
                    {getAnswerText(key, value, t)}
                  </div>
                </div>
              ))}
          </div>

          {/* Points allocation */}
          {answers.points && (
            <div data-pdf-block className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                {t('questionnaire.questions.points.question')}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(answers.points).map(([key, points]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="text-primary">
                      {attributeIcons[key as AttributeKey] || null}
                    </div>
                    <div>
                      <span className="text-gray-800">
                        {t(`questionnaire.questions.points.priorities.${key}.title`)}:
                      </span>
                      <span className="font-bold ml-1">{points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals selection */}
          {showGoals && answers.goals && (
            <div data-pdf-block className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                {t('questionnaire.questions.goals.question')}
              </h4>

              <ul className="grid grid-cols-2 gap-3">
                {Object.entries(answers.goals).map(([key, value]) => (
                  <li key={key} className="text-gray-800">
                    {key === 'other' && typeof value === 'string'
                      ? `${t('questionnaire.questions.goals.other.name')}: ${value}`
                      : t(`questionnaire.questions.goals.${key}.name`)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage selection (answers saved before goals existed) */}
          {!showGoals && answers.usage && (
            <div data-pdf-block className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                {t('questionnaire.questions.usage.question')}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(answers.usage).map(([key, value]) => {
                  const usageKey = key as UsageKey;
                  return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="text-primary">
                      {usageIcons[usageKey] || null}
                    </div>
                    <div className="text-gray-800">
                      {usageKey === 'other' && typeof value === 'string'
                        ? `${t(`questionnaire.questions.usage.options.other.title`)}: ${value}`
                        : t(`questionnaire.questions.usage.options.${key}.title`)}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Access devices */}
          {answers.accessDevices && (
            <div data-pdf-block className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                {t('questionnaire.questions.accessDevices.question')}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.keys(answers.accessDevices).map((key) => (
                  <div key={key} className="text-gray-800">
                    {t(`questionnaire.questions.accessDevices.options.${key}`)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pdf-footer mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>{t('common.generatedBy')}</p>
        <p>{t('common.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </div>
  );
};

export { PDFTemplate, type PDFTemplateProps };
export default PDFTemplate;
