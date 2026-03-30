import type {
  UsageSelectionValues,
  ServiceKey,
  OSKey,
  ServiceSuggestion,
  OSSuggestion,
  Recommendations,
  MainUseAnswer,
  FormatAnswer,
  DeviceKey,
} from '@/types/questionnaire';

// Service definitions — names and descriptions use i18n keys
const services: Record<ServiceKey, ServiceSuggestion> = {
  nextcloud: {
    key: 'nextcloud',
    name: 'services.nextcloud.name',
    description: 'services.nextcloud.description',
    category: ['files', 'news', 'education'],
    icon: '☁️',
  },
  jellyfin: {
    key: 'jellyfin',
    name: 'services.jellyfin.name',
    description: 'services.jellyfin.description',
    category: ['media'],
    icon: '🎬',
  },
  moodle: {
    key: 'moodle',
    name: 'services.moodle.name',
    description: 'services.moodle.description',
    category: ['education'],
    icon: '📚',
  },
  wordpress: {
    key: 'wordpress',
    name: 'services.wordpress.name',
    description: 'services.wordpress.description',
    category: ['news', 'education'],
    icon: '📝',
  },
  kiwix: {
    key: 'kiwix',
    name: 'services.kiwix.name',
    description: 'services.kiwix.description',
    category: ['education', 'news'],
    icon: '📖',
  },
  ubuntumm: {
    key: 'ubuntumm',
    name: 'services.ubuntumm.name',
    description: 'services.ubuntumm.description',
    category: ['files', 'education', 'news'],
    icon: '🌐',
  },
};

// OS definitions — names and descriptions use i18n keys
const operatingSystems: Record<OSKey, OSSuggestion> = {
  ubuntuServer: {
    key: 'ubuntuServer',
    name: 'os.ubuntuServer.name',
    description: 'os.ubuntuServer.description',
    recommendedFor: ['education', 'business', 'personal'],
    difficulty: 'beginner',
    supportedHardware: ['intelNUC', 'zimaBoard', 'reusedPC'],
  },
  debian: {
    key: 'debian',
    name: 'os.debian.name',
    description: 'os.debian.description',
    recommendedFor: ['business', 'personal'],
    difficulty: 'intermediate',
    supportedHardware: ['intelNUC', 'zimaBoard', 'reusedPC', 'raspberryPi'],
  },
  raspbian: {
    key: 'raspbian',
    name: 'os.raspbian.name',
    description: 'os.raspbian.description',
    recommendedFor: ['education', 'personal'],
    difficulty: 'beginner',
    supportedHardware: ['raspberryPi'],
  },
  truenas: {
    key: 'truenas',
    name: 'os.truenas.name',
    description: 'os.truenas.description',
    recommendedFor: ['business', 'education'],
    difficulty: 'intermediate',
    supportedHardware: ['intelNUC', 'zimaBoard', 'reusedPC'],
  },
  openmediavault: {
    key: 'openmediavault',
    name: 'os.openmediavault.name',
    description: 'os.openmediavault.description',
    recommendedFor: ['education', 'business'],
    difficulty: 'beginner',
    supportedHardware: ['intelNUC', 'zimaBoard', 'reusedPC', 'raspberryPi'],
  },
};

/**
 * Get service suggestions based on usage selections
 */
export const getServiceSuggestions = (
  usage: UsageSelectionValues
): ServiceSuggestion[] => {
  const selectedCategories: string[] = [];

  // Map usage keys to service categories
  if (usage.news) selectedCategories.push('news');
  if (usage.files) selectedCategories.push('files');
  if (usage.education) selectedCategories.push('education');
  if (usage.media) selectedCategories.push('media');
  // 'other' doesn't map to specific categories but we can suggest general services

  // If no specific categories selected, suggest a general set
  if (selectedCategories.length === 0) {
    return [services.nextcloud, services.wordpress, services.kiwix];
  }

  // Find services that match any selected category
  const matchedServices = Object.values(services).filter(service =>
    service.category.some(cat => selectedCategories.includes(cat))
  );

  // Remove duplicates and limit to top 5
  const uniqueServices = Array.from(
    new Map(matchedServices.map(s => [s.key, s])).values()
  );

  return uniqueServices.slice(0, 5);
};

/**
 * Get OS suggestions based on main use, user preferences, and hardware
 */
export const getOSSuggestions = (
  mainUse: MainUseAnswer | undefined,
  format: FormatAnswer | undefined,
  topDeviceKey?: DeviceKey
): OSSuggestion[] => {
  // Default to education if no main use specified
  const use = mainUse || 'education';

  // Start with all OSes matching the main use
  const allOSForUse = Object.values(operatingSystems).filter(os =>
    os.recommendedFor.includes(use)
  );

  // Filter by supported hardware if we have a device recommendation
  let osList = topDeviceKey
    ? allOSForUse.filter(os =>
        os.supportedHardware.includes(topDeviceKey)
      )
    : allOSForUse;

  // If no OS matches the hardware, return empty array instead of falling back to incompatible options
  if (osList.length === 0) {
    return [];
  }

  // If user cannot format at all, only show beginner options
  if (format === 'no') {
    osList = osList.filter(os => os.difficulty === 'beginner');
  }

  return osList.slice(0, 4);
};

/**
 * Type guard for UsageSelectionValues
 */
export function isUsageSelectionValues(usage: unknown): usage is UsageSelectionValues {
  if (!usage || typeof usage !== 'object') return false;
  
  const validKeys = ['news', 'files', 'education', 'media', 'other'];
  
  return Object.entries(usage).every(([key, value]) => {
    return validKeys.includes(key) && (value === true || typeof value === 'string');
  });
}

/**
 * Get all recommendations (services and OS) based on user answers
 */
export const getRecommendations = (
  usage: UsageSelectionValues | unknown | undefined,
  mainUse: MainUseAnswer | undefined,
  format: FormatAnswer | undefined,
  topDeviceKey?: DeviceKey
): Pick<Recommendations, 'services' | 'operatingSystems'> => {
  // Safely cast usage to UsageSelectionValues using type guard
  const typedUsage = isUsageSelectionValues(usage) ? usage : undefined;

  const serviceSuggestions = typedUsage
    ? getServiceSuggestions(typedUsage)
    : [services.nextcloud, services.wordpress];

  const osSuggestions = getOSSuggestions(mainUse, format, topDeviceKey);

  return {
    services: serviceSuggestions,
    operatingSystems: osSuggestions,
  };
};
