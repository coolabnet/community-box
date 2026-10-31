export type NetworkStatus =
  | 'active'
  | 'inactive'
  | 'inProgress'
  | 'dormant'
  | 'pilot'
  | 'planned'
  | 'ceased'
  | 'unknown';

export type NetworkService =
  | 'internet'
  | 'voice'
  | 'offline'
  | 'localServices'
  | 'financial'
  | 'support'
  | 'literacy'
  | 'radio'
  | 'schools'
  | 'cybercafe'
  | 'environmental'
  | 'charging';

export type NetworkSource = 'ccci' | 'communityBox';

export interface CommunityNetwork {
  id: string;
  name: string;
  country: string | null;
  status: NetworkStatus;
  services: NetworkService[];
  website?: string;
  // Other names for the same network (curated spellings), searchable but not shown.
  aliases?: string[];
  sources: NetworkSource[];
}

export interface CommunityDirectoryData {
  source: {
    name: string;
    url: string;
    exportUrl: string;
    retrievedAt: string;
    rows: number;
  };
  curatedSource: string;
  count: number;
  unmatchedCountries: string[];
  networks: CommunityNetwork[];
}

export interface CommunityDirectoryFile {
  timestamp: string;
  script: string;
  data: CommunityDirectoryData;
}

export interface WorldMapCountry {
  d: string;
  x: number;
  y: number;
}

export interface WorldMapGeometry {
  width: number;
  height: number;
  source: string;
  countries: Record<string, WorldMapCountry>;
}

export interface NetworkFilters {
  country?: string | null;
  status?: string | null;
  query?: string;
}

// Statuses in the order they are offered in the UI.
export const NETWORK_STATUSES: NetworkStatus[] = [
  'active',
  'inProgress',
  'pilot',
  'planned',
  'dormant',
  'inactive',
  'ceased',
  'unknown',
];

export const NETWORK_SERVICES: NetworkService[] = [
  'internet',
  'voice',
  'offline',
  'localServices',
  'financial',
  'support',
  'literacy',
  'radio',
  'schools',
  'cybercafe',
  'environmental',
  'charging',
];

// Lazy loaders: each dynamic import becomes its own chunk. Results are cached;
// a failed load clears the cache so the next call can retry.
let directoryPromise: Promise<CommunityDirectoryFile> | null = null;
let worldMapPromise: Promise<WorldMapGeometry> | null = null;

export function loadCommunityDirectory(): Promise<CommunityDirectoryFile> {
  if (!directoryPromise) {
    directoryPromise = import('@research/fetched-data/ccci-directory.json')
      .then((m) => m.default as unknown as CommunityDirectoryFile)
      .catch((err) => {
        directoryPromise = null;
        throw err;
      });
  }
  return directoryPromise;
}

export function loadWorldMapGeometry(): Promise<WorldMapGeometry> {
  if (!worldMapPromise) {
    worldMapPromise = import('@/data/world-map.json')
      .then((m) => m.default as unknown as WorldMapGeometry)
      .catch((err) => {
        worldMapPromise = null;
        throw err;
      });
  }
  return worldMapPromise;
}

export function countByCountry(networks: Pick<CommunityNetwork, 'country'>[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const network of networks) {
    if (!network.country) continue;
    counts[network.country] = (counts[network.country] ?? 0) + 1;
  }
  return counts;
}

// Lower-case and strip diacritics so "Sao" matches "São".
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function filterNetworks(networks: CommunityNetwork[], filters: NetworkFilters): CommunityNetwork[] {
  const query = filters.query ? normalizeText(filters.query) : '';
  return networks.filter((network) => {
    if (filters.country && network.country !== filters.country) return false;
    if (filters.status && network.status !== filters.status) return false;
    if (query && ![network.name, ...(network.aliases ?? [])].some((name) => normalizeText(name).includes(query))) {
      return false;
    }
    return true;
  });
}

export function countryName(code: string, lang: string): string {
  try {
    const name = new Intl.DisplayNames([lang], { type: 'region' }).of(code);
    return name && name !== code ? name : code;
  } catch {
    return code;
  }
}

export function tierFor(count: number): 1 | 2 | 3 | 4 {
  if (count >= 21) return 4;
  if (count >= 6) return 3;
  if (count >= 2) return 2;
  return 1;
}
