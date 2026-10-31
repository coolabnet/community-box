#!/usr/bin/env node
// Build app/src/data/world-map.json: one SVG path per country, keyed by
// ISO 3166-1 alpha-2 code, plus a label point (centroid of the largest
// polygon) so small island countries stay clickable.
//
// The map data is generated once and committed, so the app needs no map
// libraries at runtime. Run from a scratch directory that has the
// generator dependencies installed:
//
//   npm i world-atlas@2.0.2 d3-geo@3.1.1 topojson-client@3.1.0 i18n-iso-countries@7.14.0
//   node /path/to/app/scripts/build-world-map.mjs --deps "$PWD"
//
// Source: Natural Earth 1:110m and 1:50m via world-atlas (public domain).
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const depsIdx = args.indexOf('--deps');
const depsDir = depsIdx >= 0 ? path.resolve(args[depsIdx + 1]) : process.cwd();
const require = createRequire(path.join(depsDir, 'package.json'));

const { feature } = require('topojson-client');
const d3 = require('d3-geo');
const countries = require('i18n-iso-countries');
// 1:110m keeps the file small; countries missing from it (small islands)
// are taken from 1:50m so every country can be selected.
const topo110 = require('world-atlas/countries-110m.json');
const topo50 = require('world-atlas/countries-50m.json');

const WIDTH = 960;
const HEIGHT = 500;

const geo = feature(topo110, topo110.objects.countries);
const have = new Set(geo.features.map((f) => f.id));
for (const f of feature(topo50, topo50.objects.countries).features) {
  if (f.id && !have.has(f.id)) geo.features.push(f);
}
// Antarctica has no community networks and takes a lot of space
geo.features = geo.features.filter((f) => f.id !== '010');

const projection = d3.geoNaturalEarth1().fitSize([WIDTH, HEIGHT], geo);
const pathGen = d3.geoPath(projection).digits(1);

const largestPolygon = (f) => {
  if (f.geometry.type !== 'MultiPolygon') return f;
  let best = null;
  let bestArea = -1;
  for (const coords of f.geometry.coordinates) {
    const poly = { type: 'Feature', geometry: { type: 'Polygon', coordinates: coords } };
    const area = d3.geoArea(poly);
    if (area > bestArea) {
      bestArea = area;
      best = poly;
    }
  }
  return best;
};

const out = {};
for (const f of geo.features) {
  const code = countries.numericToAlpha2(f.id);
  if (!code) continue;
  const d = pathGen(f);
  if (!d) continue;
  const [x, y] = pathGen.centroid(largestPolygon(f));
  out[code] = { d, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(here, '../src/data/world-map.json');
mkdirSync(path.dirname(target), { recursive: true });
writeFileSync(
  target,
  JSON.stringify({ width: WIDTH, height: HEIGHT, source: 'Natural Earth 1:110m + 1:50m via world-atlas 2.0.2', countries: out })
);
console.log(`world-map.json: ${Object.keys(out).length} countries -> ${target}`);
