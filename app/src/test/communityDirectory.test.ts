import { describe, it, expect } from 'vitest';
import {
  countByCountry,
  countryName,
  filterNetworks,
  tierFor,
  type CommunityNetwork,
} from '@/utils/communityDirectory';

const networks: CommunityNetwork[] = [
  { id: '1', name: 'São Paulo Mesh', country: 'BR', status: 'active', services: ['internet'], sources: ['ccci'] },
  { id: '2', name: 'Sao Jorge Radio', country: 'BR', status: 'pilot', services: ['radio'], sources: ['ccci'] },
  { id: '3', name: 'Kibera Net', country: 'KE', status: 'active', services: ['internet', 'schools'], sources: ['communityBox'] },
  { id: '4', name: 'Nairobi Relay', country: 'KE', status: 'dormant', services: ['voice'], sources: ['ccci'] },
  { id: '5', name: 'Unknown Place', country: null, status: 'unknown', services: [], sources: ['ccci'] },
];

describe('countByCountry', () => {
  it('counts networks per ISO2 code and ignores null countries', () => {
    expect(countByCountry(networks)).toEqual({ BR: 2, KE: 2 });
  });

  it('returns an empty record for no networks', () => {
    expect(countByCountry([])).toEqual({});
  });
});

describe('filterNetworks', () => {
  it('returns everything when no filters are set', () => {
    expect(filterNetworks(networks, {})).toHaveLength(5);
  });

  it('filters by country', () => {
    expect(filterNetworks(networks, { country: 'KE' }).map((n) => n.id)).toEqual(['3', '4']);
  });

  it('filters by status', () => {
    expect(filterNetworks(networks, { status: 'pilot' }).map((n) => n.id)).toEqual(['2']);
  });

  it('matches the query case- and accent-insensitively', () => {
    expect(filterNetworks(networks, { query: 'SAO' }).map((n) => n.id)).toEqual(['1', '2']);
    expect(filterNetworks(networks, { query: 'paulo' }).map((n) => n.id)).toEqual(['1']);
  });

  it('ignores blank queries and null filters', () => {
    expect(filterNetworks(networks, { query: '   ', country: null, status: null })).toHaveLength(5);
  });

  it('combines country, status and query', () => {
    expect(filterNetworks(networks, { country: 'BR', status: 'active', query: 'mesh' }).map((n) => n.id)).toEqual(['1']);
    expect(filterNetworks(networks, { country: 'KE', status: 'pilot' })).toEqual([]);
  });
});

describe('tierFor', () => {
  it('maps counts onto the four tiers at their boundaries', () => {
    expect(tierFor(1)).toBe(1);
    expect(tierFor(2)).toBe(2);
    expect(tierFor(5)).toBe(2);
    expect(tierFor(6)).toBe(3);
    expect(tierFor(20)).toBe(3);
    expect(tierFor(21)).toBe(4);
    expect(tierFor(448)).toBe(4);
  });
});

describe('countryName', () => {
  it('returns a localized region name for a valid code', () => {
    expect(countryName('BR', 'en')).toBe('Brazil');
    expect(countryName('BR', 'pt')).toBe('Brasil');
  });

  it('falls back to the code for an invalid code', () => {
    expect(countryName('NOT-A-CODE', 'en')).toBe('NOT-A-CODE');
    expect(countryName('', 'en')).toBe('');
  });
});
