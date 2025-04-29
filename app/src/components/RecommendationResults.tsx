import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  AlertCircle
} from 'lucide-react';

// Import PDF utilities
import { downloadPDF, sharePDF } from '@/utils/pdfGenerator';
import PDFTemplate from './PDFTemplate';
import { copyUrlToClipboard, shareUrl } from '@/utils/statePersistence';

// Import board images
import raspberryPiImage from '../assets/pi.png';
import zimaImage from '../assets/zima.png';
import nucImage from '../assets/nuc.png';
import reusedPCImage from '../assets/laptop.jpg'; // Using banner as placeholder for reused PC

// Define device types and attributes
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

interface DeviceScore {
  device: DeviceAttributes;
  score: number;
  matchPercentage: number;
  strengths: AttributeKey[];
}

// Define the devices with their attributes
const devices: DeviceAttributes[] = [
  {
    key: 'raspberryPi',
    name: 'Raspberry Pi',
    energy: 5, // Very energy efficient
    concurrency: 1, // Poor for multiple users
    growth: 2, // Limited growth potential
    reusable: 0, // Not reusable (new hardware)
    formatEase: 3, // Moderate setup difficulty
    cost: 5, // Very low cost
    icon: <img src={raspberryPiImage} alt="Raspberry Pi" className="h-full w-full object-cover" />
  },
  {
    key: 'zimaBoard',
    name: 'ZimaBoard',
    energy: 4, // Good energy efficiency
    concurrency: 3, // Moderate multi-user support
    growth: 3, // Moderate growth potential
    reusable: 0, // Not reusable (new hardware)
    formatEase: 2, // More difficult to set up
    cost: 3, // Moderate cost
    icon: <img src={zimaImage} alt="ZimaBoard" className="h-full w-full object-cover" />
  },
  {
    key: 'intelNUC',
    name: 'Intel NUC',
    energy: 2, // Higher power consumption
    concurrency: 5, // Excellent for multiple users
    growth: 5, // Excellent growth potential
    reusable: 0, // Not reusable (new hardware)
    formatEase: 3, // Moderate setup difficulty
    cost: 1, // High cost
    icon: <img src={nucImage} alt="Intel NUC" className="h-full w-full object-cover" />
  },
  {
    key: 'reusedPC',
    name: 'Reused PC',
    energy: 1, // High power consumption
    concurrency: 4, // Good for multiple users
    growth: 4, // Good growth potential
    reusable: 5, // Excellent reusability (existing hardware)
    formatEase: 2, // More difficult to set up
    cost: 4, // Low cost (reused)
    icon: <img src={reusedPCImage} alt="Recycled laptop" className="h-full w-full object-cover" />
  }
];

// Map attribute keys to icons
const attributeIcons: Record<AttributeKey, React.ReactNode> = {
  energy: <Zap className="h-5 w-5" />,
  concurrency: <Users className="h-5 w-5" />,
  growth: <TrendingUp className="h-5 w-5" />,
  reusable: <Recycle className="h-5 w-5" />,
  formatEase: <WrenchIcon className="h-5 w-5" />,
  cost: <DollarSign className="h-5 w-5" />
};

// Function to normalize user answers to the 1-5 scale
const normalizeUserAnswers = (answers: UserAnswers): Record<AttributeKey, number> => {
  // Map electricity answer to energy score (1-5)
  const energyMap: Record<string, number> = {
    'yes': 5, // Reliable power -> can use any device
    'sometimes': 3, // Unreliable -> prefer energy efficient
    'no': 1 // Frequent outages -> need very energy efficient
  };

  // Map users answer to concurrency score (1-5)
  const concurrencyMap: Record<string, number> = {
    '1-2': 1, // Few users -> low concurrency needs
    '3-5': 3, // Medium users -> moderate concurrency needs
    '6+': 5 // Many users -> high concurrency needs
  };

  // Map growth answer to growth score (1-5)
  const growthMap: Record<string, number> = {
    'low': 1, // Minimal growth -> low growth needs
    'medium': 3, // Moderate growth -> moderate growth needs
    'high': 5 // Rapid growth -> high growth needs
  };

  // Map reuse answer to reusable score (0 or 5)
  const reusableMap: Record<string, number> = {
    'yes': 5, // Has computer for reuse -> high reusability
    'no': 0 // No computer for reuse -> no reusability
  };

  // Map format answer to formatEase score (1-5)
  const formatEaseMap: Record<string, number> = {
    'yes': 5, // Can format confidently -> high setup ease
    'maybe': 3, // With guidance -> moderate setup ease
    'no': 1 // Cannot format -> low setup ease
  };

  // Map price answer to cost score (1-5)
  const costMap: Record<string, number> = {
    'low': 5, // Low budget -> need low cost
    'medium': 3, // Medium budget -> moderate cost acceptable
    'high': 1 // High budget -> cost less important
  };

  return {
    energy: energyMap[answers.electricity] || 3,
    concurrency: concurrencyMap[answers.users] || 3,
    growth: growthMap[answers.growth] || 3,
    reusable: reusableMap[answers.reuse] || 0,
    formatEase: formatEaseMap[answers.format] || 3,
    cost: costMap[answers.price] || 3
  };
};

// Function to calculate device scores based on user answers and point allocation
const calculateDeviceScores = (
  answers: UserAnswers,
  normalizedAnswers: Record<AttributeKey, number>
): DeviceScore[] => {
  // Get point weights from user's point allocation
  const pointWeights: Record<AttributeKey, number> = {
    energy: answers.points.easyToUse || 0,
    concurrency: answers.points.lowPower || 0,
    growth: answers.points.language || 0,
    reusable: answers.points.scalable || 0,
    formatEase: answers.points.lowCost || 0,
    cost: answers.points.lowCost || 0
  };

  // Calculate total points allocated
  const totalPoints = Object.values(pointWeights).reduce((sum, points) => sum + points, 0);

  // Calculate normalized weights (ensure sum is 1.0)
  const normalizedWeights: Record<AttributeKey, number> = {} as Record<AttributeKey, number>;

  if (totalPoints > 0) {
    Object.keys(pointWeights).forEach(key => {
      normalizedWeights[key as AttributeKey] = pointWeights[key as AttributeKey] / totalPoints;
    });
  } else {
    // If no points allocated, use equal weights
    const equalWeight = 1 / Object.keys(pointWeights).length;
    Object.keys(pointWeights).forEach(key => {
      normalizedWeights[key as AttributeKey] = equalWeight;
    });
  }

  // Special case: if user has a computer for reuse, heavily weight the reusable attribute
  if (answers.reuse === 'yes') {
    normalizedWeights.reusable = 0.4; // 40% weight to reusability

    // Redistribute remaining 60% among other attributes
    const remainingWeight = 0.6;
    const otherAttributes = Object.keys(normalizedWeights).filter(key => key !== 'reusable');
    const weightPerAttribute = remainingWeight / otherAttributes.length;

    otherAttributes.forEach(key => {
      normalizedWeights[key as AttributeKey] = weightPerAttribute;
    });
  }

  // Calculate scores for each device
  return devices.map(device => {
    // Calculate weighted score for each attribute
    let totalScore = 0;
    const maxPossibleScore = 5; // Maximum score per attribute
    const strengths: AttributeKey[] = [];

    Object.keys(normalizedAnswers).forEach(key => {
      const attributeKey = key as AttributeKey;
      const userValue = normalizedAnswers[attributeKey];
      const deviceValue = device[attributeKey];

      // Calculate similarity (5 - absolute difference)
      // Higher similarity means better match
      const similarity = 5 - Math.abs(userValue - deviceValue);

      // Apply weight to similarity
      const weightedSimilarity = similarity * normalizedWeights[attributeKey];

      // Add to total score
      totalScore += weightedSimilarity;

      // If this is a strength (similarity >= 4), add to strengths array
      if (similarity >= 4) {
        strengths.push(attributeKey);
      }
    });

    // Calculate match percentage (0-100%)
    const maxPossibleWeightedScore = 5; // Max similarity (5) for all attributes
    const matchPercentage = (totalScore / maxPossibleWeightedScore) * 100;

    return {
      device,
      score: totalScore,
      matchPercentage: Math.round(matchPercentage),
      strengths
    };
  }).sort((a, b) => b.score - a.score); // Sort by score (highest first)
};

// Function to get match rating text based on percentage
const getMatchRating = (percentage: number, t: any): string => {
  if (percentage >= 90) return t('questionnaire.questions.results.perfectMatch');
  if (percentage >= 75) return t('questionnaire.questions.results.excellentMatch');
  if (percentage >= 60) return t('questionnaire.questions.results.goodMatch');
  return t('questionnaire.questions.results.fairMatch');
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
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Calculate device scores on component mount
  useEffect(() => {
    // Simulate calculation time for better UX
    const timer = setTimeout(() => {
      const normalizedAnswers = normalizeUserAnswers(answers);
      const scores = calculateDeviceScores(answers, normalizedAnswers);
      setDeviceScores(scores);
      setIsCalculating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [answers]);

  // Get the top recommendation
  const topRecommendation = deviceScores[0];

  // Get alternatives (exclude top recommendation)
  const alternatives = deviceScores.slice(1);

  // Function to handle PDF generation and download
  const handleExportPDF = async () => {
    if (!topRecommendation || !pdfTemplateRef.current) {
      console.error('PDF template reference is not available');
      return;
    }

    try {
      setIsPdfGenerating(true);

      // Make sure the template is visible during capture
      const templateElement = pdfTemplateRef.current;
      const originalDisplay = templateElement.style.display;
      templateElement.style.display = 'block';
      templateElement.style.position = 'absolute';
      templateElement.style.top = '-9999px';
      templateElement.style.left = '-9999px';
      document.body.appendChild(templateElement);

      // Wait for the template to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate and download the PDF
      await downloadPDF(templateElement, {
        filename: 'community-box-recommendation.pdf',
        quality: 2,
        scale: 2
      });

      // Restore the template's original state
      templateElement.style.display = originalDisplay;
      templateElement.style.position = '';
      templateElement.style.top = '';
      templateElement.style.left = '';

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

      // Make sure the template is visible during capture
      const templateElement = pdfTemplateRef.current;
      const originalDisplay = templateElement.style.display;
      templateElement.style.display = 'block';
      templateElement.style.position = 'absolute';
      templateElement.style.top = '-9999px';
      templateElement.style.left = '-9999px';
      document.body.appendChild(templateElement);

      // Wait for the template to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate and share the PDF
      await sharePDF(templateElement, {
        filename: 'community-box-recommendation.pdf',
        quality: 2,
        scale: 2
      });

      // Restore the template's original state
      templateElement.style.display = originalDisplay;
      templateElement.style.position = '';
      templateElement.style.top = '';
      templateElement.style.left = '';

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
                          {(t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.pros`, { returnObjects: true }) as string[]).map((pro: string, index: number) => (
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
                          {(t(`questionnaire.questions.results.devices.${topRecommendation.device.key}.cons`, { returnObjects: true }) as string[]).map((con: string, index: number) => (
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
                                      {(t(`questionnaire.questions.results.devices.${alternative.device.key}.pros`, { returnObjects: true }) as string[]).map((pro: string, i: number) => (
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
                                      {(t(`questionnaire.questions.results.devices.${alternative.device.key}.cons`, { returnObjects: true }) as string[]).map((con: string, i: number) => (
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
