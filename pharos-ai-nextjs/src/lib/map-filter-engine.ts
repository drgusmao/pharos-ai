import { ACTOR_META, TYPE_META, STATUS_META, PRIORITY_META } from '@/data/mapTokens';

import type { StrikeArc, MissileTrack, Target, Asset, ThreatZone, HeatPoint } from '@/data/mapData';
import type { ActorMeta } from '@/data/mapTokens';

// ─── Types ──────────────────────────────────────────────────────────────────────

export type DataArrays = {
  strikes:  StrikeArc[];
  missiles: MissileTrack[];
  targets:  Target[];
  assets:   Asset[];
  zones:    ThreatZone[];
  heat:     HeatPoint[];
};

export type FacetOption = {
  key:    string;
  label:  string;
  count:  number;     // how many items match RIGHT NOW (cross-filtered)
  total:  number;     // how many exist in unfiltered data
  color?: string;     // CSS var for display
  group?: string;     // for grouping (e.g. "Coalition" / "Adversary")
};

export type FilterFacets = {
  datasets:   FacetOption[];
  types:      FacetOption[];
  actors:     FacetOption[];
  statuses:   FacetOption[];
  priorities: FacetOption[];
};

export type FilterState = {
  datasets:   Set<string>;
  types:      Set<string>;
  actors:     Set<string>;
  statuses:   Set<string>;
  priorities: Set<string>;
  heat:       boolean;
};

export type FilteredData = {
  strikes:  StrikeArc[];
  missiles: MissileTrack[];
  targets:  Target[];
  assets:   Asset[];
  zones:    ThreatZone[];
  heat:     HeatPoint[];
};

type DataItem = { actor: string; priority: string; type: string; status?: string };

// ─── Helpers ────────────────────────────────────────────────────────────────────

const DATASET_LABELS: Record<string, string> = {
  strikes: 'Strikes', missiles: 'Missiles', targets: 'Targets', assets: 'Assets', zones: 'Zones',
};

function allItems(data: DataArrays): { dataset: string; item: DataItem }[] {
  const out: { dataset: string; item: DataItem }[] = [];
  for (const s of data.strikes)  out.push({ dataset: 'strikes',  item: s });
  for (const m of data.missiles) out.push({ dataset: 'missiles', item: m });
  for (const t of data.targets)  out.push({ dataset: 'targets',  item: t });
  for (const a of data.assets)   out.push({ dataset: 'assets',   item: a });
  for (const z of data.zones)    out.push({ dataset: 'zones',    item: z as DataItem });
  return out;
}

function actorLabel(key: string, meta: Record<string, ActorMeta>): string {
  return meta[key]?.label ?? key;
}

function actorColor(key: string, meta: Record<string, ActorMeta>): string | undefined {
  return meta[key]?.cssVar;
}

function actorGroup(key: string, meta: Record<string, ActorMeta>): string | undefined {
  return meta[key]?.group;
}

// ─── Extract facets (unfiltered totals) ─────────────────────────────────────────

export function extractInitialState(data: DataArrays): FilterState {
  const items = allItems(data);
  const datasets = new Set<string>();
  const types = new Set<string>();
  const actors = new Set<string>();
  const statuses = new Set<string>();
  const priorities = new Set<string>();

  for (const { dataset, item } of items) {
    datasets.add(dataset);
    types.add(item.type);
    actors.add(item.actor);
    if (item.status) statuses.add(item.status);
    priorities.add(item.priority);
  }

  return { datasets, types, actors, statuses, priorities, heat: true };
}

// ─── Apply filters + compute cross-filtered facets ──────────────────────────────

export function applyFilters(
  data: DataArrays,
  state: FilterState,
  actorMeta: Record<string, ActorMeta> = ACTOR_META,
): { filtered: FilteredData; facets: FilterFacets; totalVisible: number; totalAll: number } {
  const items = allItems(data);
  const totalAll = items.length;

  // Pass predicate for a single item
  const passes = (dataset: string, item: DataItem): boolean => {
    if (!state.datasets.has(dataset)) return false;
    if (!state.types.has(item.type)) return false;
    if (!state.actors.has(item.actor)) return false;
    if (!state.priorities.has(item.priority)) return false;
    if (item.status && !state.statuses.has(item.status)) return false;
    return true;
  };

  // Filter data
  const filtered: FilteredData = {
    strikes:  state.datasets.has('strikes')  ? data.strikes.filter(d  => passes('strikes', d))  : [],
    missiles: state.datasets.has('missiles') ? data.missiles.filter(d => passes('missiles', d)) : [],
    targets:  state.datasets.has('targets')  ? data.targets.filter(d  => passes('targets', d))  : [],
    assets:   state.datasets.has('assets')   ? data.assets.filter(d   => passes('assets', d))   : [],
    zones:    state.datasets.has('zones')    ? data.zones.filter(d    => passes('zones', d as DataItem)) : [],
    heat:     state.heat ? data.heat : [],
  };

  const totalVisible = filtered.strikes.length + filtered.missiles.length +
    filtered.targets.length + filtered.assets.length + filtered.zones.length;

  // Cross-filtered counts: for each facet option, count how many items
  // WOULD pass if that option were the only change
  const crossCount = (
    check: (dataset: string, item: DataItem) => boolean,
  ) => {
    let c = 0;
    for (const { dataset, item } of items) if (check(dataset, item)) c++;
    return c;
  };

  // Build dataset facets
  const dsMap = new Map<string, { total: number; count: number }>();
  for (const { dataset, item } of items) {
    const e = dsMap.get(dataset) ?? { total: 0, count: 0 };
    e.total++;
    // Count = passes all filters except dataset (would show if this dataset toggled on)
    if (state.types.has(item.type) && state.actors.has(item.actor) &&
        state.priorities.has(item.priority) && (!item.status || state.statuses.has(item.status))) {
      e.count++;
    }
    dsMap.set(dataset, e);
  }
  const datasets: FacetOption[] = ['strikes', 'missiles', 'targets', 'assets', 'zones']
    .filter(k => dsMap.has(k))
    .map(k => ({ key: k, label: DATASET_LABELS[k] ?? k, count: dsMap.get(k)!.count, total: dsMap.get(k)!.total }));

  // Build type facets — SCOPED to active datasets only.
  // If only "assets" is active, only asset types (CARRIER, AIR_BASE, etc.) appear.
  const typeMap = new Map<string, { total: number; count: number }>();
  for (const { dataset, item } of items) {
    // Only include types from active datasets — this is the hierarchy link
    if (!state.datasets.has(dataset)) continue;
    const e = typeMap.get(item.type) ?? { total: 0, count: 0 };
    e.total++;
    if (state.actors.has(item.actor) &&
        state.priorities.has(item.priority) && (!item.status || state.statuses.has(item.status))) {
      e.count++;
    }
    typeMap.set(item.type, e);
  }
  const types: FacetOption[] = [...typeMap.entries()]
    .filter(([, v]) => v.total > 0)
    .map(([k, v]) => ({
      key: k, label: TYPE_META[k]?.label ?? k,
      count: v.count, total: v.total,
      group: TYPE_META[k]?.category,
    }));

  // Build actor facets — scoped to active datasets + types
  const actMap = new Map<string, { total: number; count: number }>();
  for (const { dataset, item } of items) {
    if (!state.datasets.has(dataset)) continue;
    if (!state.types.has(item.type)) continue;
    const e = actMap.get(item.actor) ?? { total: 0, count: 0 };
    e.total++;
    if (state.priorities.has(item.priority) && (!item.status || state.statuses.has(item.status))) {
      e.count++;
    }
    actMap.set(item.actor, e);
  }
  const actors: FacetOption[] = [...actMap.entries()].map(([k, v]) => ({
    key: k, label: actorLabel(k, actorMeta), count: v.count, total: v.total,
    color: actorColor(k, actorMeta), group: actorGroup(k, actorMeta),
  }));

  // Build status facets — scoped to active datasets + types
  const statMap = new Map<string, { total: number; count: number }>();
  for (const { dataset, item } of items) {
    if (!item.status) continue;
    if (!state.datasets.has(dataset)) continue;
    if (!state.types.has(item.type)) continue;
    const e = statMap.get(item.status) ?? { total: 0, count: 0 };
    e.total++;
    if (state.actors.has(item.actor) && state.priorities.has(item.priority)) {
      e.count++;
    }
    statMap.set(item.status, e);
  }
  const statuses: FacetOption[] = [...statMap.entries()].map(([k, v]) => ({
    key: k, label: STATUS_META[k as keyof typeof STATUS_META]?.label ?? k,
    count: v.count, total: v.total,
    color: STATUS_META[k as keyof typeof STATUS_META]?.cssVar,
  }));

  // Build priority facets
  const priMap = new Map<string, { total: number; count: number }>();
  for (const { dataset, item } of items) {
    const e = priMap.get(item.priority) ?? { total: 0, count: 0 };
    e.total++;
    if (state.datasets.has(dataset) && state.types.has(item.type) &&
        state.actors.has(item.actor) && (!item.status || state.statuses.has(item.status))) {
      e.count++;
    }
    priMap.set(item.priority, e);
  }
  const priorities: FacetOption[] = [...priMap.entries()].map(([k, v]) => ({
    key: k, label: PRIORITY_META[k as keyof typeof PRIORITY_META]?.label ?? k,
    count: v.count, total: v.total,
    color: PRIORITY_META[k as keyof typeof PRIORITY_META]?.cssVar,
  }));

  return { filtered, facets: { datasets, types, actors, statuses, priorities }, totalVisible, totalAll };
}
