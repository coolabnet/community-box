import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

// Define the device types and attributes
type DeviceKey = 'raspberryPi' | 'zimaBoard' | 'intelNUC' | 'reusedPC';
type AttributeKey = 'energy' | 'concurrency' | 'growth' | 'reusable' | 'formatEase' | 'cost';

interface DeviceAttributes {
  key: DeviceKey;
  name: string;
  energy: number;
  concurrency: number;
  growth: number;
  reusable: number;
  formatEase: number;
  cost: number;
  icon: React.ReactNode;
}

interface DeviceScore {
  device: DeviceAttributes;
  score: number;
  matchPercentage: number;
  strengths: AttributeKey[];
}

interface UserAnswers {
  electricity?: string;
  users?: string;
  growth?: string;
  reuse?: string;
  format?: string;
  price?: string;
  points?: Record<string, number>;
  usage?: Record<string, any>;
  mainUse?: string;
  [key: string]: any;
}

interface PDFTemplateProps {
  recommendation: DeviceScore;
  alternatives: DeviceScore[];
  answers: UserAnswers;
}

// Map attribute keys to icons
const attributeIcons: Record<AttributeKey, React.ReactNode> = {
  energy: <Zap className="h-5 w-5" />,
  concurrency: <Users className="h-5 w-5" />,
  growth: <TrendingUp className="h-5 w-5" />,
  reusable: <Recycle className="h-5 w-5" />,
  formatEase: <WrenchIcon className="h-5 w-5" />,
  cost: <DollarSign className="h-5 w-5" />
};

// Map usage keys to icons
const usageIcons: Record<string, React.ReactNode> = {
  news: <Newspaper className="h-5 w-5" />,
  files: <FileText className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />,
  media: <Radio className="h-5 w-5" />,
  other: <MoreHorizontal className="h-5 w-5" />
};

// Function to get match rating text based on percentage
const getMatchRating = (percentage: number, t: any): string => {
  if (percentage >= 90) return t('questionnaire.questions.results.perfectMatch');
  if (percentage >= 75) return t('questionnaire.questions.results.excellentMatch');
  if (percentage >= 60) return t('questionnaire.questions.results.goodMatch');
  return t('questionnaire.questions.results.fairMatch');
};

// Function to get human-readable answer text
const getAnswerText = (questionId: string, value: any, t: any): string => {
  if (questionId === 'points') {
    return 'Point allocation'; // This is handled separately
  }

  if (questionId === 'usage') {
    return 'Usage selection'; // This is handled separately
  }

  if (typeof value === 'string') {
    return t(`questionnaire.questions.${questionId}.options.${value}`);
  }

  return String(value);
};

const PDFTemplate = ({ recommendation, alternatives, answers }: PDFTemplateProps) => {
  const { t } = useTranslation();
  const pdfRef = useRef<HTMLDivElement>(null);

  // Get the top recommendation
  const topRecommendation = recommendation;

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
            alt="Community Box Logo"
            className="h-16 w-auto"
            onError={(e) => {
              // Fallback if logo fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Top recommendation */}
      <div className="pdf-recommendation mb-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
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
            <h4 className="font-medium mb-2 text-gray-800">Pros</h4>
            <ul className="space-y-1">
              {t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.pros`, { returnObjects: true }).map((pro: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-2 text-gray-800">Cons</h4>
            <ul className="space-y-1">
              {t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.cons`, { returnObjects: true }).map((con: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-4 w-4 text-gray-400 mt-1 shrink-0">-</span>
                  <span className="text-gray-600">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2 text-gray-800">Ideal For</h4>
          <p className="text-gray-700">{t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.idealFor`)}</p>
        </div>
      </div>

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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User answers summary */}
      <div className="pdf-answers mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Your Answers Summary
        </h3>

        <div className="space-y-4">
          {/* Basic questions */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(answers)
              .filter(([key]) => !['points', 'usage'].includes(key))
              .map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
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
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
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

          {/* Usage selection */}
          {answers.usage && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                {t('questionnaire.questions.usage.question')}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(answers.usage).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="text-primary">
                      {usageIcons[key] || null}
                    </div>
                    <div className="text-gray-800">
                      {key === 'other' && typeof value === 'string'
                        ? `${t(`questionnaire.questions.usage.options.other.title`)}: ${value}`
                        : t(`questionnaire.questions.usage.options.${key}.title`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pdf-footer mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Generated by Community Box Recommendation Tool</p>
        <p>© {new Date().getFullYear()} Community Box Project</p>
      </div>
    </div>
  );
};

export { PDFTemplate, type PDFTemplateProps };
export default PDFTemplate;
