import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tArray } from '@/lib/i18n-helpers';
import { CatalogMeta } from './CatalogMeta';
import { cn } from '@/lib/utils';
import {
  Cpu,
  Zap,
  Users,
  TrendingUp,
  Recycle,
  WrenchIcon,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Check,
  Download,
  RotateCcw,
  ExternalLink,
  FileText,
  Share2,
  Mail,
  MessageCircle,
  AlertCircle,
  HardDrive,
  Settings,
  Package,
  Lightbulb,
} from 'lucide-react';

// Import PDF utilities
import { downloadPDF, sharePDF } from '@/utils/pdfGenerator';
import PDFTemplate from './PDFTemplate';
import { copyUrlToClipboard, shareUrl } from '@/utils/statePersistence';
import {
  buildRecommendation,
  visibleFitReasons,
  type IncompatibleApplication,
} from '@/utils/recommendationPipeline';
import type { ResultApplication } from '@/utils/resultApplications';
import type { Capacity } from '@/utils/applications';
import { Badge } from '@/components/ui/badge';
import type {
  AccessDeviceKey,
  TechSupportAnswer,
  AttributeKey,
  DeviceKey,
  DeviceScore,
  UserAnswers,
  OSSuggestion,
} from '@/types/questionnaire';

// Access device keys in display order, used for the connection tips
const accessDeviceKeys: AccessDeviceKey[] = ['smartphones', 'laptops', 'desktops', 'shared'];
const techSupportKeys: TechSupportAnswer[] = ['community', 'external', 'no'];

// Map attribute keys to icons
const attributeIcons: Record<AttributeKey, ReactNode> = {
  energy: <Zap className="h-5 w-5" />,
  concurrency: <Users className="h-5 w-5" />,
  growth: <TrendingUp className="h-5 w-5" />,
  reusable: <Recycle className="h-5 w-5" />,
  formatEase: <WrenchIcon className="h-5 w-5" />,
  cost: <DollarSign className="h-5 w-5" />
};

// Function to get match rating text based on percentage
const getMatchRating = (percentage: number, t: TFunction): string => {
  if (percentage >= 90) return t('questionnaire.questions.results.perfectMatch');
  if (percentage >= 75) return t('questionnaire.questions.results.excellentMatch');
  if (percentage >= 60) return t('questionnaire.questions.results.goodMatch');
  return t('questionnaire.questions.results.fairMatch');
};

// Move the PDF template into body for capture, run the job, then put the node back
// where React rendered it and restore its inline styles, even when capture fails.
const withTemplateInBody = async <T,>(
  templateElement: HTMLElement,
  job: (element: HTMLElement) => Promise<T>
): Promise<T> => {
  const parent = templateElement.parentNode;
  const nextSibling = templateElement.nextSibling;
  const originalCssText = templateElement.style.cssText;

  // Make the template visible during capture, off-screen
  templateElement.style.display = 'block';
  templateElement.style.position = 'absolute';
  templateElement.style.top = '-9999px';
  templateElement.style.left = '-9999px';
  document.body.appendChild(templateElement);

  try {
    // Wait for the template to be rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    return await job(templateElement);
  } finally {
    if (parent) {
      if (nextSibling && nextSibling.parentNode === parent) {
        parent.insertBefore(templateElement, nextSibling);
      } else {
        parent.appendChild(templateElement);
      }
    }
    templateElement.style.cssText = originalCssText;
  }
};

// Main component
const RecommendationResults = ({
  answers,
  onStartOver
}: {
  answers: UserAnswers,
  onStartOver: () => void
}) => {
  const { t } = useTranslation();
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [deviceScores, setDeviceScores] = useState<DeviceScore[]>([]);
  const [isCalculating, setIsCalculating] = useState(true);
  const [showDetails, setShowDetails] = useState<DeviceKey | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<boolean | null>(null);
  const [serviceSuggestions, setServiceSuggestions] = useState<ResultApplication[]>([]);
  const [osSuggestions, setOSSuggestions] = useState<OSSuggestion[]>([]);
  const [capacity, setCapacity] = useState<Capacity | undefined>(undefined);
  const [incompatibleApps, setIncompatibleApps] = useState<IncompatibleApplication[]>([]);
  const [unverifiedApps, setUnverifiedApps] = useState<ResultApplication[]>([]);
  const [osPlatformsIncomplete, setOsPlatformsIncomplete] = useState(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Calculate device scores and recommendations on component mount
  useEffect(() => {
    // Simulate calculation time for better UX
    const timer = setTimeout(() => {
      const result = buildRecommendation(answers);
      setDeviceScores(result.deviceScores);
      setServiceSuggestions(result.applications);
      setOSSuggestions(result.operatingSystems);
      setCapacity(result.capacity);
      setIncompatibleApps(result.incompatible);
      setUnverifiedApps(result.unverified);
      setOsPlatformsIncomplete(result.osPlatformsIncomplete);

      setIsCalculating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [answers]);

  // Connection tips for the devices people use (suggestions only, not scored)
  const accessTipKeys = accessDeviceKeys.filter(key => answers.accessDevices?.[key]);

  // Setup tip for the support people have (suggestion only, not scored)
  const supportTipKey = techSupportKeys.find(key => key === answers.techSupport);

  // Get the top recommendation
  const topRecommendation = deviceScores[0];

  // Get alternatives (exclude top recommendation)
  const alternatives = deviceScores.slice(1);

  // Capacity is computed only in the goals flow (goals + apps answered)
  const isGoalsFlow = capacity !== undefined;

  // Capacity-fit lines for a device card: plain text spans, not alerts.
  // `belowRecommendedRam` stays hidden under unknown confidence; the variant
  // hint stays but its copy is hedged (visibleFitReasons + estimated key).
  // `onTint` raises contrast on the tinted top card (muted there fails contrast).
  const renderFitLines = (score: DeviceScore, className = '', onTint = false) => {
    const lines = visibleFitReasons(score, capacity).map(reason => ({
      reason,
      text:
        reason === 'chooseRamVariant'
          ? t(
              capacity?.confidence === 'unknown'
                ? 'questionnaire.questions.results.fit.chooseRamVariantEstimated'
                : 'questionnaire.questions.results.fit.chooseRamVariant',
              { ram: score.suggestedRamGb ?? '' }
            )
          : t(`questionnaire.questions.results.fit.${reason}`),
    }));
    if (lines.length === 0) return null;
    return (
      <div className={cn('mt-1 space-y-0.5 text-xs', className)}>
        {lines.map(({ reason, text }) => (
          <span
            key={reason}
            className={cn(
              'block',
              score.fit === 'insufficient'
                ? 'text-red-700 dark:text-red-400'
                : onTint
                  ? 'text-foreground/80'
                  : 'text-muted-foreground'
            )}
          >
            {text}
          </span>
        ))}
      </div>
    );
  };

  // Function to handle PDF generation and download
  const handleExportPDF = async () => {
    if (!topRecommendation || !pdfTemplateRef.current) {
      console.error('PDF template reference is not available');
      return;
    }

    try {
      setIsPdfGenerating(true);

      // Generate and download the PDF
      await withTemplateInBody(pdfTemplateRef.current, element =>
        downloadPDF(element, {
          filename: 'community-box-recommendation.pdf',
          quality: 0.95,
          scale: 2
        })
      );

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Function to handle PDF sharing
  const handleSharePDF = async () => {
    if (!topRecommendation || !pdfTemplateRef.current) {
      console.error('PDF template reference is not available');
      return;
    }

    try {
      setIsPdfGenerating(true);

      // Generate and share the PDF
      await withTemplateInBody(pdfTemplateRef.current, element =>
        sharePDF(element, {
          filename: 'community-box-recommendation.pdf',
          quality: 0.95,
          scale: 2
        })
      );

    } catch (error) {
      console.error('Error sharing PDF:', error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Function to share via WhatsApp
  const handleShareWhatsApp = () => {
    const deviceName = t(`questionnaire.questions.results.devices.${topRecommendation?.device.key}.name`);
    const text = encodeURIComponent(`${t('questionnaire.questions.results.shareText')}: ${deviceName}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Function to share via Email
  const handleShareEmail = () => {
    const deviceName = t(`questionnaire.questions.results.devices.${topRecommendation?.device.key}.name`);
    const subject = encodeURIComponent(t('questionnaire.questions.results.emailSubject'));
    const body = encodeURIComponent(t('questionnaire.questions.results.emailBody', { device: deviceName }));
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Function to share answers via URL
  const handleShareAnswers = async () => {
    try {
      // Try to use Web Share API first
      const shareResult = await shareUrl(
        t('questionnaire.questions.results.shareTitle'),
        t('questionnaire.questions.results.shareText')
      );

      if (!shareResult) {
        // Fallback to clipboard copy
        const copyResult = await copyUrlToClipboard();
        setShareSuccess(copyResult);

        // Reset success message after 3 seconds
        if (copyResult) {
          setTimeout(() => {
            setShareSuccess(null);
          }, 3000);
        }
      } else {
        setShareSuccess(true);
      }
    } catch (error) {
      console.error('Error sharing answers:', error);
      setShareSuccess(false);
    }
  };

  // Function to export results as text
  const handleExportText = () => {
    // Create a text summary of the results
    let summary = `${t('questionnaire.questions.results.title')}\n\n`;

    // Add top recommendation
    if (topRecommendation) {
      summary += `${t('questionnaire.questions.results.subtitle')}\n`;
      summary += `${t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.name`)}\n`;
      summary += `${t('questionnaire.questions.results.matchScore')}: ${topRecommendation.matchPercentage}%\n`;
      summary += `${t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.description`)}\n\n`;

      // Add strengths
      summary += `${t('questionnaire.questions.results.whyThisRecommendation')}\n`;
      topRecommendation.strengths.forEach(strength => {
        summary += `- ${t(`questionnaire.questions.results.reasonings.${strength}`)}\n`;
      });

      summary += '\n';
    }

    // Add alternatives
    if (alternatives.length > 0) {
      summary += `${t('questionnaire.questions.results.viewAlternatives')}:\n`;
      alternatives.forEach(alt => {
        summary += `- ${t(`questionnaire.questions.results.devices.${alt.device.key}.name`)} (${alt.matchPercentage}%)\n`;
      });
    }

    // Create a blob and download
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'community-box-recommendation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            {t('questionnaire.questions.results.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('questionnaire.questions.results.subtitle')}
          </p>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {isCalculating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative h-24 w-24">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary/30"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-t-4 border-primary"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <Cpu className="absolute inset-0 m-auto h-10 w-10 text-primary" />
              </div>
              <p className="mt-6 text-lg font-medium">{t('questionnaire.questions.results.calculating')}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* All devices insufficient (goals flow): keep the device list visible */}
              {capacity && deviceScores.every(s => s.fit === 'insufficient') && (
                <div
                  role="status"
                  className="mb-8 p-4 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-medium"
                >
                  {t('questionnaire.questions.results.fit.allInsufficient')}
                </div>
              )}

              {/* Top recommendation */}
              {topRecommendation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-xl shadow-lg border border-border overflow-hidden mb-8"
                >
                  <div className="bg-primary/10 p-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full shadow-md h-20 w-20 md:h-44 md:w-44 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-primary/20 bg-white">
                          {topRecommendation.device.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold md:pl-12">
                            {t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.name`)}
                          </h2>
                          <p className="text-muted-foreground md:pl-12">
                            {t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.description`)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-primary">
                          {topRecommendation.matchPercentage}%
                        </div>
                        <div className="text-sm font-medium">
                          {getMatchRating(topRecommendation.matchPercentage, t)}
                        </div>
                        {capacity && (
                          <div className="text-xs text-foreground/80 text-center mt-2 max-w-xs">
                            <p>
                              {capacity.confidence === 'unknown'
                                ? t('questionnaire.questions.results.capacity.summaryUnknown', {
                                    minRamGb: capacity.minRamGb,
                                  })
                                : t('questionnaire.questions.results.capacity.summary', {
                                    minRamGb: capacity.minRamGb,
                                    recommendedRamGb: capacity.recommendedRamGb,
                                  })}
                            </p>
                            {capacity.minStorageGb > 0 && (
                              <p>
                                {t('questionnaire.questions.results.capacity.storage', {
                                  minStorageGb: capacity.minStorageGb,
                                })}
                              </p>
                            )}
                            <p>
                              {t(
                                `questionnaire.questions.results.capacity.confidence.${capacity.confidence}`
                              )}
                            </p>
                            <p>
                              {t('questionnaire.questions.results.capacity.heuristicNote')}
                            </p>
                          </div>
                        )}
                        {renderFitLines(topRecommendation, '', true)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                      {t('questionnaire.questions.results.whyThisRecommendation')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {topRecommendation.strengths.map((strength) => (
                        <div
                          key={strength}
                          className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg"
                        >
                          <div className="text-primary">
                            {attributeIcons[strength]}
                          </div>
                          <div>
                            <div className="font-medium">
                              {t(`questionnaire.questions.results.attributes.${strength}`)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t(`questionnaire.questions.results.reasonings.${strength}`)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{t('questionnaire.questions.results.pros')}</h4>
                        <ul className="space-y-1">
                          {tArray(t, `questionnaire.questions.results.devices.${topRecommendation.device.key}.pros`).map((pro: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{t('questionnaire.questions.results.cons')}</h4>
                        <ul className="space-y-1">
                          {tArray(t, `questionnaire.questions.results.devices.${topRecommendation.device.key}.cons`).map((con: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-muted-foreground">
                              <span className="h-4 w-4 text-muted-foreground mt-1 shrink-0">-</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="font-medium mb-2">{t('questionnaire.questions.results.idealFor')}</h4>
                      <p>{t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.idealFor`)}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Alternatives toggle */}
              {alternatives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    className="w-full py-6 flex items-center justify-center gap-2"
                  >
                    {showAlternatives ? (
                      <>
                        {t('questionnaire.questions.results.hideAlternatives')}
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {t('questionnaire.questions.results.viewAlternatives')}
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Alternative recommendations */}
              <AnimatePresence>
                {showAlternatives && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 mb-8 overflow-hidden"
                  >
                    {alternatives.map((alternative, index) => (
                      <motion.div
                        key={alternative.device.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-card rounded-lg border border-border overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full shadow-md h-20 w-20 md:h-44 md:w-44 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-primary/20 bg-white">
                                {alternative.device.icon}
                              </div>
                              <div>
                                <h3 className="font-medium md:text-4xl md:pl-12">
                                  {t(`questionnaire.questions.results.devices.${alternative.device.key}.name`)}
                                </h3>
                                <p className="text-sm text-muted-foreground md:pl-12">
                                  {getMatchRating(alternative.matchPercentage, t)} ({alternative.matchPercentage}%)
                                </p>
                                {renderFitLines(alternative, 'md:pl-12')}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDetails(showDetails === alternative.device.key ? null : alternative.device.key)}
                            >
                              {showDetails === alternative.device.key ? (
                                <ChevronUp className="h-4 w-4 md:h-12 md:w-12" />
                              ) : (
                                <ChevronDown className="h-4 w-4 md:h-12 md:w-12" />
                              )}
                            </Button>
                          </div>

                          <AnimatePresence>
                            {showDetails === alternative.device.key && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 pt-4 border-t border-border overflow-hidden"
                              >
                                <p className="mb-3">
                                  {t(`questionnaire.questions.results.devices.${alternative.device.key}.description`)}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">{t('questionnaire.questions.results.pros')}</h4>
                                    <ul className="text-sm space-y-1">
                                      {tArray(t, `questionnaire.questions.results.devices.${alternative.device.key}.pros`).map((pro: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <Check className="h-3 w-3 text-green-500 mt-1 shrink-0" />
                                          <span>{pro}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">{t('questionnaire.questions.results.cons')}</h4>
                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                      {tArray(t, `questionnaire.questions.results.devices.${alternative.device.key}.cons`).map((con: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="h-3 w-3 mt-1 shrink-0">-</span>
                                          <span>{con}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Services and Operating Systems Recommendations */}
              {!isCalculating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="space-y-8 mb-8"
                >
                  {/* Connection tips Section */}
                  {accessTipKeys.length > 0 && (
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="bg-primary/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-bold">
                            {t('questionnaire.questions.results.accessTips.title')}
                          </h3>
                        </div>
                      </div>
                      <ul className="p-4 space-y-3 list-disc pl-10 text-sm">
                        {accessTipKeys.map(key => (
                          <li key={key}>{t(`questionnaire.questions.results.accessTips.items.${key}`)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Setup support tip Section */}
                  {supportTipKey && (
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="bg-primary/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-bold">
                            {t('questionnaire.questions.results.supportTips.title')}
                          </h3>
                        </div>
                      </div>
                      <p className="p-4 text-sm">
                        {t(`questionnaire.questions.results.supportTips.items.${supportTipKey}`)}
                      </p>
                    </div>
                  )}

                  {/* Services Section */}
                  {(
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="bg-primary/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">
                              {t('questionnaire.questions.results.services.title') || 'Recommended Services'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t('questionnaire.questions.results.services.description') || 'Self-hosted software for your Community Box'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        {serviceSuggestions.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            {t('questionnaire.questions.results.services.none')}
                          </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {serviceSuggestions.map((service, index) => (
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-2xl">{service.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{t(`${service.i18nKey}.name`)}</h4>
                                <p className="text-xs text-muted-foreground">{t(`${service.i18nKey}.description`)}</p>
                                {(service.status === 'candidate' || service.offline === 'full' || service.network === 'needsInternet') && (
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {service.status === 'candidate' && (
                                      <Badge variant="outline">{t('questionnaire.questions.applications.badges.lessEvidence')}</Badge>
                                    )}
                                    {service.offline === 'full' && (
                                      <Badge variant="secondary">{t('questionnaire.questions.applications.badges.worksOffline')}</Badge>
                                    )}
                                    {service.network === 'needsInternet' && (
                                      <Badge variant="outline">{t('questionnaire.questions.applications.badges.needsInternet')}</Badge>
                                    )}
                                  </div>
                                )}
                                <CatalogMeta links={service.links} requirements={service.requirements} />
                              </div>
                              {(!isGoalsFlow || !service.links?.length) && (
                                <a
                                  href={`https://duckduckgo.com/?q=${encodeURIComponent(t(`${service.i18nKey}.name`) + ' self-hosted')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 shrink-0"
                                  aria-label={t(`${service.i18nKey}.name`)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compatible apps we could not fully check (goals flow) */}
                  {isGoalsFlow && unverifiedApps.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t('questionnaire.questions.results.unverified.label')}{' '}
                      {unverifiedApps.map(u => t(`${u.i18nKey}.name`)).join(', ')}
                    </p>
                  )}
                  {isGoalsFlow && osPlatformsIncomplete && (
                    <p className="text-sm text-muted-foreground">
                      {t('questionnaire.questions.results.unverified.platforms')}
                    </p>
                  )}

                  {/* Applications not compatible with this setup (goals flow) */}
                  {incompatibleApps.length > 0 && (
                    <details className="bg-card rounded-xl border border-border overflow-hidden">
                      <summary className="p-4 cursor-pointer text-sm font-medium select-none">
                        {t('questionnaire.questions.results.incompatible.title')}
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground">
                        <p className="mb-2">
                          {t('questionnaire.questions.results.incompatible.description')}
                        </p>
                        <ul className="space-y-1">
                          {incompatibleApps.map(({ application, reasons }) => (
                            <li key={application.id}>
                              {t(`${application.i18nKey}.name`)}
                              {': '}
                              {reasons
                                .map(reason =>
                                  t(`questionnaire.questions.results.incompatible.reasons.${reason}`)
                                )
                                .join(' ')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  )}

                  {/* Operating Systems Section */}
                  {osSuggestions.length > 0 && (
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="bg-primary/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <HardDrive className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">
                              {t('questionnaire.questions.results.operatingSystems.title') || 'Recommended Operating Systems'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t('questionnaire.questions.results.operatingSystems.description') || 'OS options to run on your hardware'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {osSuggestions.map((os, index) => (
                            <motion.div
                              key={os.key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Settings className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm">{t(`questionnaire.questions.results.operatingSystems.items.${os.key}.name`)}</h4>
                                  <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    os.difficulty === 'beginner' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                    os.difficulty === 'intermediate' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                    os.difficulty === 'advanced' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  )}>
                                    {t(`questionnaire.questions.results.operatingSystems.difficulty.${os.difficulty}`)}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{t(`questionnaire.questions.results.operatingSystems.items.${os.key}.description`)}</p>
                                <CatalogMeta links={os.links} requirements={os.requirements} />
                              </div>
                              <a
                                href={`https://duckduckgo.com/?q=${encodeURIComponent(t(`questionnaire.questions.results.operatingSystems.items.${os.key}.name`) + ' download')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 shrink-0"
                                aria-label={t(`questionnaire.questions.results.operatingSystems.items.${os.key}.name`)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action buttons */}
              {/* Share success message */}
              <AnimatePresence>
                {shareSuccess !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium",
                      shareSuccess
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {shareSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{t('questionnaire.questions.results.linkCopied')}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>{t('questionnaire.questions.results.linkCopyFailed')}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-4 mt-8"
              >
                {/* Share answers button */}
                <Button
                  variant="secondary"
                  className="w-full py-6"
                  onClick={handleShareAnswers}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('questionnaire.questions.results.shareMyAnswers')}
                </Button>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 py-6"
                    onClick={onStartOver}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('questionnaire.questions.results.startOver')}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex-1 py-6"
                        disabled={isPdfGenerating}
                      >
                        {isPdfGenerating ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            {t('questionnaire.questions.results.generating')}
                          </div>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            {t('questionnaire.questions.results.exportAsPDF')}
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={handleExportPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>{t('questionnaire.questions.results.downloadPDF')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSharePDF}>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>{t('questionnaire.questions.results.sharePDF')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShareWhatsApp}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>{t('questionnaire.questions.results.shareViaWhatsApp')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShareEmail}>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>{t('questionnaire.questions.results.shareViaEmail')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportText}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>{t('questionnaire.questions.results.exportAsText')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden PDF template for export */}
      {topRecommendation && (
        <div style={{ display: 'none' }}>
          <div ref={pdfTemplateRef} className="pdf-template">
            <PDFTemplate
              recommendation={topRecommendation}
              alternatives={alternatives.slice(0, 2)}
              answers={answers}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecommendationResults;
