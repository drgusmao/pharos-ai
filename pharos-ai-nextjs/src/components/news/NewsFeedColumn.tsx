'use client';

import { useEffect, useState, useRef } from 'react';
import type { RssFeed } from '@/data/rssFeeds';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  creator?: string;
  isoDate?: string;
  categories?: string[];
}

interface FeedResult {
  feedId: string;
  feedTitle: string;
  items: FeedItem[];
  error?: string;
}

interface NewsFeedColumnProps {
  feed: RssFeed;
  color: string;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const ms = Date.now() - new Date(dateStr).getTime();
  if (ms < 0) return 'just now';
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NewsFeedColumn({ feed, color }: NewsFeedColumnProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function load() {
      try {
        const res = await fetch(`/api/rss?ids=${feed.id}`);
        const data = await res.json();
        const result: FeedResult = data.feeds?.[0];
        if (result?.error) {
          setError(result.error);
        } else if (result?.items) {
          setItems(result.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [feed.id]);

  return (
    <div className="flex flex-col min-w-[300px] max-w-[380px] flex-1 border-r border-[var(--bd)] last:border-r-0">
      {/* Column header */}
      <div className="px-4 py-3 border-b border-[var(--bd)] bg-[var(--bg-1)] flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <h3 className="mono text-[11px] font-bold text-[var(--t1)] tracking-wide truncate">
            {feed.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] mono text-[var(--t4)]">{feed.country}</span>
            {feed.stateFunded && (
              <span className="px-1 py-0 bg-amber-500/15 border border-amber-500/30 rounded text-[7px] mono font-bold text-amber-400">
                STATE FUNDED
              </span>
            )}
          </div>
        </div>
        <span className="text-[9px] mono text-[var(--t4)]">
          {items.length > 0 ? `${items.length} items` : ''}
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-4 py-6 text-center">
            <span className="text-[10px] text-red-400/60 mono">FEED ERROR</span>
            <p className="text-[9px] text-[var(--t4)] mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="px-4 py-6 text-center">
            <span className="text-[10px] text-[var(--t4)] mono">NO ITEMS</span>
          </div>
        )}

        {items.map((item, idx) => (
          <a
            key={`${item.link}-${idx}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 border-b border-[var(--bd)] hover:bg-[var(--bg-2)] transition-colors no-underline group"
          >
            <div className="flex items-start gap-2">
              <div
                className="w-1 h-1 rounded-full mt-1.5 shrink-0 opacity-60"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] text-[var(--t1)] font-medium leading-tight group-hover:text-white line-clamp-3">
                  {item.title}
                </h4>
                {item.contentSnippet && (
                  <p className="text-[9px] text-[var(--t4)] mt-1 leading-relaxed line-clamp-2">
                    {item.contentSnippet}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[8px] mono text-[var(--t4)]">
                    {timeAgo(item.isoDate ?? item.pubDate)}
                  </span>
                  {item.creator && (
                    <span className="text-[8px] mono text-[var(--t4)] truncate max-w-[150px]">
                      {item.creator}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
