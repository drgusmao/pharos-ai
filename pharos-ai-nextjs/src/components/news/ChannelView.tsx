'use client';

import type { ConflictChannel } from '@/data/rssFeeds';
import { getFeedsForChannel } from '@/data/rssFeeds';
import { NewsFeedColumn } from './NewsFeedColumn';

interface ChannelViewProps {
  channel: ConflictChannel;
}

export function ChannelView({ channel }: ChannelViewProps) {
  const feeds = getFeedsForChannel(channel.feedIds);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Channel description bar */}
      <div className="px-5 py-2 bg-[var(--bg-2)] border-b border-[var(--bd)] flex items-center gap-3">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: channel.color }} />
        <div>
          <span className="mono text-[10px] font-bold text-[var(--t2)] tracking-wider">
            {channel.label}
          </span>
          <span className="text-[9px] text-[var(--t4)] ml-3">{channel.description}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[8px] mono text-[var(--t4)] uppercase tracking-wider">
            {channel.perspective}
          </span>
        </div>
      </div>

      {/* Feed columns */}
      <div className="flex-1 flex overflow-x-auto min-h-0">
        {feeds.map(feed => (
          <NewsFeedColumn key={feed.id} feed={feed} color={channel.color} />
        ))}
      </div>
    </div>
  );
}
