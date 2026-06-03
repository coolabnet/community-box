import type { ReactNode } from 'react';
import type {
  AttributeKey,
  DeviceAttributes,
  DeviceScore,
  PriorityAllocation,
  UserAnswers,
} from '@/types/questionnaire';

// Import board images
import raspberryPiImage from '../assets/pi.png';
import zimaImage from '../assets/zima.png';
import nucImage from '../assets/nuc.png';
import reusedPCImage from '../assets/laptop.jpg'; // Using banner as placeholder for reused PC

// Define the devices with their attributes
export const devices: DeviceAttributes[] = [
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

// Function to normalize user answers to the 1-5 scale
export const normalizeUserAnswers = (answers: UserAnswers): Record<AttributeKey, number> => {
  // Map electricity answer to energy score (1-5)
  // Higher value = greater need for energy efficiency.
  // The similarity formula (5 - |user - device|) matches user needs to device capabilities,
  // so a user with frequent outages (high need) gets a high value, matching efficient devices.
  const energyMap: Record<string, number> = {
    'yes': 1, // Reliable power → low need for efficiency
    'sometimes': 3, // Unreliable → moderate need for efficiency
    'no': 5 // Frequent outages → high need for efficiency
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
  // Higher value = greater need for easy setup.
  // The similarity formula (5 - |user - device|) matches user needs to device capabilities,
  // so a user who cannot format (high need for easy setup) gets a high value,
  // matching devices that are easier to set up.
  const formatEaseMap: Record<string, number> = {
    'yes': 1, // Can format confidently → low need for easy setup
    'maybe': 3, // With guidance → moderate need for easy setup
    'no': 5 // Cannot format → high need for easy setup
  };

  // Map price answer to cost score (1-5)
  const costMap: Record<string, number> = {
    'low': 5, // Low budget -> need low cost
    'medium': 3, // Medium budget -> moderate cost acceptable
    'high': 1 // High budget -> cost less important
  };

  return {
    energy: energyMap[answers.electricity] || 3,
    concurrency: concurrencyMap[answers.users ?? '1-2'] || 3,
    growth: growthMap[answers.growth] || 3,
    reusable: reusableMap[answers.reuse] || 0,
    formatEase: formatEaseMap[answers.format] || 3,
    cost: costMap[answers.price] || 3
  };
};

// Function to calculate device scores based on user answers and point allocation
export const calculateDeviceScores = (
  answers: UserAnswers,
  normalizedAnswers: Record<AttributeKey, number>
): DeviceScore[] => {
  const points: PriorityAllocation = answers.points ?? {};

  // Get point weights from user's point allocation
  // Mapping: easyToUse→formatEase, lowPower→energy, scalable→growth, lowCost→cost
  // language is excluded from device scoring (no corresponding hardware attribute).
  // Its points are redistributed proportionally among the other 4 priority-driven attributes.
  // concurrency is driven by the `users` answer, not by priorities — it gets a baseline weight
  // proportional to the user's concurrency needs so that multi-user scenarios influence rankings.
  // reusable is driven by the `reuse` answer special case below, not by priorities.

  const languagePoints = points.language ?? 0;
  const priorityKeys: AttributeKey[] = ['energy', 'growth', 'formatEase', 'cost'];

  // Start with direct priority allocations
  const pointWeights: Record<AttributeKey, number> = {
    energy: points.lowPower ?? 0,
    concurrency: 0,
    growth: points.scalable ?? 0,
    reusable: 0,
    formatEase: points.easyToUse ?? 0,
    cost: points.lowCost ?? 0
  };

  // Redistribute language points proportionally among the 4 priority-driven attributes
  if (languagePoints > 0) {
    const totalPriorityPoints = priorityKeys.reduce((sum, key) => sum + pointWeights[key], 0);
    if (totalPriorityPoints > 0) {
      // Distribute proportionally to existing allocations
      priorityKeys.forEach(key => {
        pointWeights[key] += languagePoints * (pointWeights[key] / totalPriorityPoints);
      });
    } else {
      // All priorities were 0 — distribute equally
      const share = languagePoints / priorityKeys.length;
      priorityKeys.forEach(key => {
        pointWeights[key] = share;
      });
    }
  }

  // Derive concurrency baseline weight from the `users` answer
  // More users → higher concurrency weight so multi-user needs influence device ranking
  const concurrencyBaselineWeight: Record<string, number> = {
    '1-2': 0.5,   // Low concurrency need — small baseline weight
    '3-5': 1.5,   // Moderate — meaningful weight
    '6+': 3,      // High — strong influence on ranking
  };
  const rawUsers = answers.users ?? '1-2';
  // User allocated at least one priority point (any priority or language)
  const userAllocatedPoints = Object.values(points).some(p => p > 0);
  pointWeights.concurrency = userAllocatedPoints
    ? (concurrencyBaselineWeight[rawUsers] ?? 0.5)
    : 0;

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

    // Redistribute remaining 60% proportionally among other attributes,
    // preserving derived weights (e.g. concurrency from the `users` answer)
    const otherAttributes = Object.keys(normalizedWeights).filter(key => key !== 'reusable') as AttributeKey[];
    const otherTotal = otherAttributes.reduce((sum, key) => sum + normalizedWeights[key], 0);

    if (otherTotal > 0) {
      // Scale existing proportions to fill the remaining 60%
      otherAttributes.forEach(key => {
        normalizedWeights[key] = 0.6 * (normalizedWeights[key] / otherTotal);
      });
    } else {
      // Fallback: equal distribution if all weights were zero
      const weightPerAttribute = 0.6 / otherAttributes.length;
      otherAttributes.forEach(key => {
        normalizedWeights[key] = weightPerAttribute;
      });
    }
  }

  // Calculate scores for each device
  return devices.map(device => {
    // Calculate weighted score for each attribute
    let totalScore = 0;
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
    // Max possible score is 5 (perfect similarity) weighted by actual weights
    const maxPossibleWeightedScore = 5 * Object.values(normalizedWeights).reduce((sum, w) => sum + w, 0);
    const matchPercentage = maxPossibleWeightedScore > 0 ? (totalScore / maxPossibleWeightedScore) * 100 : 0;

    return {
      device,
      score: totalScore,
      matchPercentage: Math.round(matchPercentage),
      strengths
    };
  }).sort((a, b) => b.score - a.score); // Sort by score (highest first)
};
