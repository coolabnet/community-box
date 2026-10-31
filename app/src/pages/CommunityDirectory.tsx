import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2 } from 'lucide-react';
import WorldMap from '@/components/WorldMap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  NETWORK_STATUSES,
  countByCountry,
  countryName,
  filterNetworks,
  loadCommunityDirectory,
  loadWorldMapGeometry,
  type CommunityDirectoryFile,
  type CommunityNetwork,
  type NetworkStatus,
} from '@/utils/communityDirectory';

const PAGE_SIZE = 30;
const ALL_VALUE = 'all';
const BACKGROUND_PATH = '/docs/results/global-community-networks-directory';

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; file: CommunityDirectoryFile };

type FilterKey = 'country' | 'status' | 'q';

function isSafeWebsite(url: string | undefined): url is string {
  return Boolean(url) && /^https?:\/\//i.test(url as string);
}

export default function CommunityDirectory() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;
    Promise.all([loadCommunityDirectory(), loadWorldMapGeometry()])
      .then(([file]) => {
        if (active) setLoad({ status: 'ready', file });
      })
      .catch(() => {
        if (active) setLoad({ status: 'error' });
      });
    return () => {
      active = false;
    };
  }, []);

  const networks: CommunityNetwork[] = useMemo(
    () => (load.status === 'ready' ? load.file.data.networks : []),
    [load],
  );
  const counts = useMemo(() => countByCountry(networks), [networks]);
  const presentStatuses = useMemo(
    () => NETWORK_STATUSES.filter((status) => networks.some((network) => network.status === status)),
    [networks],
  );
  const countryOptions = useMemo(
    () =>
      Object.keys(counts)
        .map((code) => ({ code, name: countryName(code, lang), count: counts[code] }))
        .sort((a, b) => a.name.localeCompare(b.name, lang)),
    [counts, lang],
  );

  // Invalid URL values are ignored, not written back.
  const rawCountry = searchParams.get('country');
  const rawStatus = searchParams.get('status');
  const country = rawCountry && counts[rawCountry] ? rawCountry : null;
  const status = rawStatus && presentStatuses.includes(rawStatus as NetworkStatus) ? rawStatus : null;
  const query = searchParams.get('q') ?? '';

  // Local draft keeps the input responsive while the URL catches up.
  const [queryDraft, setQueryDraft] = useState(query);

  const filtered = useMemo(
    () => filterNetworks(networks, { country, status, query }),
    [networks, country, status, query],
  );

  const hasFilters = Boolean(country || status || query.trim());

  const updateParams = (changes: Partial<Record<FilterKey, string | null>>) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setQueryDraft('');
    updateParams({ country: null, status: null, q: null });
  };

  if (load.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('directory.loading')}</span>
        </div>
      </div>
    );
  }

  if (load.status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{t('directory.error')}</p>
        </div>
      </div>
    );
  }

  const { source } = load.file.data;
  const retrievedDate = new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(source.retrievedAt));
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-6 pb-4 border-b border-gray-200">
          {t('directory.title')}
        </h1>

        <p className="text-gray-700 mb-4">{t('directory.intro')}</p>
        <p className="text-sm mb-1">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {t('directory.source', { date: retrievedDate })}
          </a>
        </p>
        <p className="text-sm text-muted-foreground mb-8">{t('directory.curatedNote')}</p>

        <WorldMap
          counts={counts}
          selected={country}
          onSelect={(code) => updateParams({ country: code })}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-4 items-end">
          <div className="space-y-2">
            <Label>{t('directory.filters.country')}</Label>
            <Select
              value={country ?? ALL_VALUE}
              onValueChange={(value) => updateParams({ country: value === ALL_VALUE ? null : value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>{t('directory.filters.allCountries')}</SelectItem>
                {countryOptions.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    {`${option.name} (${option.count})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('directory.filters.status')}</Label>
            <Select
              value={status ?? ALL_VALUE}
              onValueChange={(value) => updateParams({ status: value === ALL_VALUE ? null : value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>{t('directory.filters.allStatuses')}</SelectItem>
                {presentStatuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`directory.status.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="community-directory-search">{t('directory.filters.search')}</Label>
            <Input
              id="community-directory-search"
              type="search"
              value={queryDraft}
              placeholder={t('directory.filters.searchPlaceholder')}
              onChange={(event) => {
                setQueryDraft(event.target.value);
                updateParams({ q: event.target.value || null });
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {t('directory.results', { count: filtered.length })}
          </p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {t('directory.filters.clear')}
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-center text-muted-foreground">{t('directory.empty')}</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {visible.map((network) => (
              <Card key={network.id}>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900">{network.name}</h3>
                  {network.country && (
                    <p className="text-sm text-muted-foreground">{countryName(network.country, lang)}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{t(`directory.status.${network.status}`)}</Badge>
                    {network.services.map((service) => (
                      <Badge key={service} variant="outline">
                        {t(`directory.services.${service}`)}
                      </Badge>
                    ))}
                  </div>
                  {isSafeWebsite(network.website) && (
                    <a
                      href={network.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {t('directory.website')}
                    </a>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {network.sources.map((sourceKey) => (
                      <span key={sourceKey} className="text-[11px] text-muted-foreground">
                        {t(`directory.sources.${sourceKey}`)}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filtered.length > visibleCount && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
              {t('directory.showMore')}
            </Button>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link to={BACKGROUND_PATH} className="text-blue-600 hover:text-blue-800 hover:underline">
            {t('directory.backgroundLink')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
