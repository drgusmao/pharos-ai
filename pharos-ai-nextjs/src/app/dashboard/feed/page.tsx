'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { usePanelLayout } from '@/hooks/use-panel-layout';
import { EVENTS, type Severity, type EventType } from '@/data/iranEvents';
import { FeedFilterRail, ALL_TYPES } from '@/components/feed/FeedFilterRail';
import { EventLog } from '@/components/feed/EventLog';
import { EventDetail } from '@/components/feed/EventDetail';
import { EmptyState } from '@/components/shared/EmptyState';

function IntelFeedInner() {
  const searchParams = useSearchParams();
  const initEvent    = searchParams.get('event');

  const [sevFilter,  setSevFilter]  = useState<Record<Severity, boolean>>({ CRITICAL: true, HIGH: true, STANDARD: true });
  const [typeFilter, setTypeFilter] = useState<Record<EventType, boolean>>(
    Object.fromEntries(ALL_TYPES.map(t => [t, true])) as Record<EventType, boolean>,
  );
  const [verOnly, setVerOnly] = useState(false);
  const [selId,   setSelId]   = useState<string | null>(initEvent);
  const [tab,     setTab]     = useState<'report' | 'signals'>('report');
  const { defaultLayout, onLayoutChanged } = usePanelLayout({ id: 'feed', panelIds: ['filters', 'log', 'detail'] });

  useEffect(() => { if (initEvent) setSelId(initEvent); }, [initEvent]);

  const filtered = useMemo(() => EVENTS.filter(e => {
    if (!sevFilter[e.severity]) return false;
    if (!typeFilter[e.type])    return false;
    if (verOnly && !e.verified) return false;
    return true;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  [sevFilter, typeFilter, verOnly]);

  const selected = EVENTS.find(e => e.id === selId) ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
      <ResizablePanelGroup orientation="horizontal" defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} className="flex-1 min-h-0 min-w-0 w-full">
      <ResizablePanel id="filters" defaultSize="15%" minSize="10%" maxSize="25%" className="flex flex-col overflow-hidden min-w-[220px]">
        <FeedFilterRail
          sevFilter={sevFilter}
          typeFilter={typeFilter}
          verOnly={verOnly}
          totalFiltered={filtered.length}
          onSevChange={(s, v) => setSevFilter(p => ({ ...p, [s]: v }))}
          onTypeChange={(t, v) => setTypeFilter(p => ({ ...p, [t]: v }))}
          onVerChange={setVerOnly}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="log" defaultSize="30%" minSize="20%" maxSize="45%" className="flex flex-col overflow-hidden min-w-[320px]">
        <EventLog
          events={filtered}
          selectedId={selId}
          onSelect={id => { setSelId(id); if (id) setTab('report'); }}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="detail" defaultSize="55%" minSize="30%" className="flex flex-col overflow-hidden min-w-0">
        {selected
          ? <EventDetail event={selected} tab={tab} onTabChange={setTab} />
          : <EmptyState icon={FileText} message="Select an event" />
        }
      </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default function IntelFeedPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center"><span className="label">Loading…</span></div>}>
      <IntelFeedInner />
    </Suspense>
  );
}
