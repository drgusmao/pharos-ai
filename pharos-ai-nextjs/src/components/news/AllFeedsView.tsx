'use client';

import { RSS_FEEDS } from '@/data/rssFeeds';
import { NewsFeedColumn } from './NewsFeedColumn';
import { useState, useMemo } from 'react';

const PERSPECTIVES = ['ALL', 'WESTERN', 'US_GOV', 'ISRAELI', 'IRANIAN', 'ARAB', 'RUSSIAN', 'CHINESE', 'INDEPENDENT', 'INTL_ORG'] as const;

const PERSPECTIVE_COLORS: Record<string, string> = {
  ALL: '#6b7280',
  WESTERN: '#3b82f6',
  US_GOV: '#60a5fa',
  ISRAELI: '#a78bfa',
  IRANIAN: '#ef4444',
  ARAB: '#f59e0b',
  RUSSIAN: '#f97316',
  CHINESE: '#dc2626',
  INDEPENDENT: '#10b981',
  INTL_ORG: '#6366f1',
};

export function AllFeedsView() {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = useMemo(
    () => filter === 'ALL' ? RSS_FEEDS : RSS_FEEDS.filter(f => f.perspective === filter),
    [filter],
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Filter bar */}
      <div className="px-5 py-2 bg-[var(--bg-2)] border-b border-[var(--bd)] flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[9px] mono text-[var(--t4)] mr-2 shrink-0">FILTER:</span>
        {PERSPECTIVES.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`
              px-2 py-1 rounded text-[9px] mono font-bold tracking-wider transition-colors shrink-0
              ${filter === p
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[var(--t4)] hover:text-[var(--t2)] hover:bg-[var(--bg-1)] border border-transparent'
              }
            `}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PERSPECTIVE_COLORS[p] }} />
              {p.replace('_', ' ')}
            </div>
          </button>
        ))}
        <span className="text-[8px] mono text-[var(--t4)] ml-auto shrink-0">
          {filtered.length} feeds
        </span>
      </div>

      {/* Feed columns — horizontal scroll */}
      <div className="flex-1 flex overflow-x-auto min-h-0">
        {filtered.map(feed => (
          <NewsFeedColumn
            key={feed.id}
            feed={feed}
            color={PERSPECTIVE_COLORS[feed.perspective] ?? '#6b7280'}
          />
        ))}
      </div>
    </div>
  );
}
