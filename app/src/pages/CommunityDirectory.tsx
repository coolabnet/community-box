import { useMemo, useRef, useState, useEffect, type ComponentType } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BatteryCharging,
  Coffee,
  ExternalLink,
  Globe,
  GraduationCap,
  HandHelping,
  Leaf,
  Loader2,
  MapPin,
  Network,
  Phone,
  Radio,
  School,
  Search,
  SearchX,
  Server,
  Wallet,
  Wifi,
  X,
} from 'lucide-react';
import WorldMap from '@/components/WorldMap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  type NetworkService,
  type NetworkStatus,
} from '@/utils/communityDirectory';
import { flagEmoji } from '@/utils/mapZoom';

const PAGE_SIZE = 30;
const ALL_VALUE = 'all';
const BACKGROUND_PATH = '/docs/results/global-community-networks-directory';

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; file: CommunityDirectoryFile };

type FilterKey = 'country' | 'status' | 'q';

type StatusTone = 'emerald' | 'sky' | 'amber' | 'rose' | 'slate';

const STATUS_TONE: Record<NetworkStatus, StatusTone> = {
  active: 'emerald',
  inProgress: 'sky',
  pilot: 'sky',
  planned: 'sky',
  dormant: 'amber',
  inactive: 'amber',
  ceased: 'rose',
  unknown: 'slate',
};

const TONE_ACCENT: Record<StatusTone, string> = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-400 dark:bg-slate-500',
};

const TONE_BADGE: Record<StatusTone, string> = {
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  sky: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200',
  amber: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  rose: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200',
  slate: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
};

const SERVICE_ICON: Record<NetworkService, ComponentType<{ className?: string }>> = {
  internet: Wifi,
  voice: Phone,
  offline: Network,
  localServices: Server,
  financial: Wallet,
  support: HandHelping,
  literacy: GraduationCap,
  radio: Radio,
  schools: School,
  cybercafe: Coffee,
  environmental: Leaf,
  charging: BatteryCharging,
};

function isSafeWebsite(url: string | undefined): url is string {
  return Boolean(url) && /^https?:\/\//i.test(url as string);
}

export default function CommunityDirectory() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const mapRef = useRef<HTMLDivElement>(null);

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
  const activeCount = useMemo(() => networks.filter((network) => network.status === 'active').length, [networks]);

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

  const showCountryOnMap = (code: string) => {
    updateParams({ country: code });
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    mapRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
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
  const numberFormat = new Intl.NumberFormat(lang);
  const countryCount = Object.keys(counts).length;
  const stats = [
    { key: 'networks', value: networks.length, label: t('directory.stats.networks', { count: networks.length }), icon: Network },
    { key: 'countries', value: countryCount, label: t('directory.stats.countries', { count: countryCount }), icon: Globe },
    { key: 'active', value: activeCount, label: t('directory.stats.active', { count: activeCount }), icon: Activity },
  ];
  const selectedName = country ? countryName(country, lang) : '';

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
      <header className="relative overflow-hidden rounded-t-2xl border-b bg-gradient-to-br from-emerald-50 via-white to-sky-100 px-5 py-8 sm:px-8 dark:from-emerald-950/60 dark:via-slate-950 dark:to-sky-950/60">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t('directory.title')}</h1>
          <p className="mt-3 max-w-3xl text-base text-slate-700 dark:text-slate-300">{t('directory.intro')}</p>
          <p className="mt-3 text-sm">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300"
            >
              {t('directory.source', { date: retrievedDate })}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t('directory.curatedNote')}</p>

          <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
            {stats.map(({ key, value, label, icon: Icon }) => (
              <div
                key={key}
                className="rounded-xl border bg-background/75 p-3 shadow-sm backdrop-blur-sm sm:p-4"
              >
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
                  <Icon className="hidden h-4 w-4 text-emerald-700 sm:block dark:text-emerald-300" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                  {numberFormat.format(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-8 sm:py-8">
        <div ref={mapRef} className="scroll-mt-24">
          <WorldMap
            counts={counts}
            selected={country}
            onSelect={(code) => updateParams({ country: code })}
          />
        </div>

        <div className="z-10 mt-8 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur-sm sm:sticky sm:top-[4.75rem] sm:p-4 lg:top-0">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)] md:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="community-directory-country" className="sr-only sm:not-sr-only">{t('directory.filters.country')}</Label>
              <Select
                value={country ?? ALL_VALUE}
                onValueChange={(value) => updateParams({ country: value === ALL_VALUE ? null : value })}
              >
                <SelectTrigger
                  id="community-directory-country"
                  className="justify-start gap-2 text-left [&>span]:flex-1 [&>svg:last-child]:shrink-0"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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

            <div className="space-y-1.5">
              <Label htmlFor="community-directory-status" className="sr-only sm:not-sr-only">{t('directory.filters.status')}</Label>
              <Select
                value={status ?? ALL_VALUE}
                onValueChange={(value) => updateParams({ status: value === ALL_VALUE ? null : value })}
              >
                <SelectTrigger
                  id="community-directory-status"
                  className="justify-start gap-2 text-left [&>span]:flex-1 [&>svg:last-child]:shrink-0"
                >
                  <Activity className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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

            <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
              <Label htmlFor="community-directory-search" className="sr-only sm:not-sr-only">{t('directory.filters.search')}</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="community-directory-search"
                  type="search"
                  className="pl-9"
                  value={queryDraft}
                  placeholder={t('directory.filters.searchPlaceholder')}
                  onChange={(event) => {
                    setQueryDraft(event.target.value);
                    updateParams({ q: event.target.value || null });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="mr-auto text-sm font-medium text-muted-foreground" aria-live="polite">
              {t('directory.results', { count: filtered.length })}
            </p>
            {country && (
              <button
                type="button"
                onClick={() => updateParams({ country: null })}
                aria-label={t('directory.filters.clearCountry', { country: selectedName })}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100 dark:hover:bg-amber-900"
              >
                {flagEmoji(country) && <span aria-hidden="true">{flagEmoji(country)}</span>}
                {selectedName}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t('directory.filters.clear')}
              </Button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed px-6 py-12 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </span>
            <p className="font-medium text-foreground">{t('directory.empty')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('directory.emptyHint')}</p>
            <Button variant="outline" className="mt-5" onClick={clearFilters}>
              {t('directory.filters.clear')}
            </Button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((network) => {
              const tone = STATUS_TONE[network.status] ?? 'slate';
              const flag = flagEmoji(network.country);
              const name = network.country ? countryName(network.country, lang) : '';
              return (
                <li
                  key={network.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className={`h-1 w-full ${TONE_ACCENT[tone]}`} aria-hidden="true" />
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                      <h3 className="min-w-0 text-base font-semibold leading-snug text-foreground">{network.name}</h3>
                      <Badge variant="outline" className={`font-medium ${TONE_BADGE[tone]}`}>
                        {t(`directory.status.${network.status}`)}
                      </Badge>
                    </div>

                    {network.country && (
                      <button
                        type="button"
                        onClick={() => showCountryOnMap(network.country as string)}
                        aria-label={t('directory.showOnMap', { country: name })}
                        className="-mx-1 inline-flex w-fit items-center gap-1.5 rounded-md px-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-emerald-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-emerald-300"
                      >
                        {flag ? (
                          <span aria-hidden="true">{flag}</span>
                        ) : (
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{name}</span>
                      </button>
                    )}

                    {network.services.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5">
                        {network.services.map((service) => {
                          const Icon = SERVICE_ICON[service];
                          return (
                            <li
                              key={service}
                              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/80"
                            >
                              {Icon && <Icon className="h-3 w-3 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />}
                              {t(`directory.services.${service}`)}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                      <p className="text-[11px] text-muted-foreground">
                        {network.sources.map((sourceKey) => t(`directory.sources.${sourceKey}`)).join(' · ')}
                      </p>
                      {isSafeWebsite(network.website) && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <a
                            href={network.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('directory.websiteLabel', { name: network.name })}
                            title={t('directory.website')}
                          >
                            <ExternalLink />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {filtered.length > visibleCount && (
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            {t('directory.showMore')}
          </Button>
        )}

        <div className="mt-10 border-t pt-6">
          <Link
            to={BACKGROUND_PATH}
            className="inline-flex items-center gap-1.5 font-medium text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300"
          >
            {t('directory.backgroundLink')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
