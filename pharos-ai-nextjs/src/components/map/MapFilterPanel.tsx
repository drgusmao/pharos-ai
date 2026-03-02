'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import FilterSection from '@/components/map/FilterSection';

import { LAYER_DISPLAY } from '@/data/mapTokens';
import { ALL_DATASETS, DATASET_LABEL } from '@/hooks/use-map-filters';

import type { FilterFacets, FilterState } from '@/lib/map-filter-engine';
import type { DatasetName } from '@/hooks/use-map-filters';

type Props = {
  state: FilterState; facets: FilterFacets;
  totalVisible: number; totalAll: number; isFiltered: boolean;
  onToggleDataset: (d: string) => void; onToggleType: (t: string) => void;
  onToggleActor: (a: string) => void; onTogglePriority: (p: string) => void;
  onToggleStatus: (s: string) => void; onToggleHeat: () => void; onReset: () => void;
};

function DatasetBtn({ name, isOn, onClick }: { name: DatasetName; isOn: boolean; onClick: () => void }) {
  const m = LAYER_DISPLAY[name];
  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={onClick}
      className="mono rounded-sm px-1.5 py-0 h-5 text-[8px] font-bold tracking-wider"
      style={{
        border: `1px solid ${isOn ? m.border : 'var(--bd)'}`,
        background: isOn ? m.bg : 'var(--bg-1)',
        color: isOn ? m.color : 'var(--t4)',
      }}
    >
      {DATASET_LABEL[name]}
    </Button>
  );
}

export default function MapFilterPanel(props: Props) {
  const { state, facets, totalVisible, totalAll, isFiltered } = props;
  const { onToggleDataset, onToggleType, onToggleActor, onTogglePriority, onToggleStatus, onToggleHeat, onReset } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const heatMeta = LAYER_DISPLAY.heat;

  return (
    <div className="flex flex-col items-end gap-1">
      {/* ── Top bar: datasets + heat + expand ─────────────────────────── */}
      <div
        className="flex items-center gap-1 rounded-sm"
        style={{ background: 'rgba(28,33,39,0.95)', border: '1px solid var(--bd)', padding: '4px 6px' }}
      >
        {ALL_DATASETS.map(d => (
          <DatasetBtn key={d} name={d} isOn={state.datasets.has(d)} onClick={() => onToggleDataset(d)} />
        ))}

        {/* Heat toggle */}
        <Button
          variant="ghost"
          size="xs"
          onClick={onToggleHeat}
          className="mono rounded-sm px-1.5 py-0 h-5 text-[8px] font-bold tracking-wider"
          style={{
            border: `1px solid ${state.heat ? heatMeta.border : 'var(--bd)'}`,
            background: state.heat ? heatMeta.bg : 'var(--bg-1)',
            color: state.heat ? heatMeta.color : 'var(--t4)',
          }}
        >
          HEAT
        </Button>

        <div className="w-px h-3.5 bg-[var(--bd)] mx-0.5 flex-shrink-0" />

        {/* Expand / collapse */}
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setIsExpanded(e => !e)}
          className="rounded-sm px-1 h-5"
          style={{
            border: `1px solid ${isExpanded || isFiltered ? 'var(--blue)' : 'var(--bd)'}`,
            background: isExpanded || isFiltered ? 'var(--blue-dim)' : 'var(--bg-1)',
            color: isExpanded || isFiltered ? 'var(--blue-l)' : 'var(--t4)',
          }}
        >
          {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </Button>

        {/* Close — resets and collapses */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onReset}
            className="rounded-sm px-1 h-5"
            style={{ border: '1px solid var(--danger)', background: 'var(--danger-dim)', color: 'var(--danger)' }}
          >
            <X size={9} />
          </Button>
        )}
      </div>

      {/* ── Expanded panel ────────────────────────────────────────────── */}
      {isExpanded && (
        <div
          className="rounded-sm overflow-y-auto"
          style={{ background: 'rgba(28,33,39,0.97)', border: '1px solid var(--bd)', width: 260, maxHeight: 'calc(100vh - 120px)' }}
        >
          <FilterSection title="TYPE" options={facets.types} activeKeys={state.types} onToggle={onToggleType} isColumned />
          <FilterSection title="ACTOR" options={facets.actors} activeKeys={state.actors} onToggle={onToggleActor} isGrouped />
          <FilterSection title="STATUS" options={facets.statuses} activeKeys={state.statuses} onToggle={onToggleStatus} />
          <FilterSection title="PRIORITY" options={facets.priorities} activeKeys={state.priorities} onToggle={onTogglePriority} />

          {/* Footer */}
          <div
            className="flex items-center justify-between px-2.5 py-2"
            style={{ borderTop: '1px solid var(--bd-s)' }}
          >
            <span className="mono text-[var(--t3)]">
              {totalVisible} / {totalAll} visible
            </span>
            {isFiltered && (
              <Button
                variant="outline"
                size="xs"
                onClick={onReset}
                className="mono text-[8px] tracking-wider text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-dim)]"
              >
                RESET FILTERS
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
