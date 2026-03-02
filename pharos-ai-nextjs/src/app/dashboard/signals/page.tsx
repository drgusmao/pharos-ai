'use client';
import { useState, useMemo } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { usePanelLayout } from '@/hooks/use-panel-layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X_POSTS, type XPost } from '@/data/iranXPosts';
import XPostCard from '@/components/shared/XPostCard';
import { SignalFilterRail, type Significance, type AccountType } from '@/components/signals/SignalFilterRail';
import { SectionHeader } from '@/components/signals/SectionHeader';

export default function SignalsPage() {
  const [sigFilter,  setSigFilter]  = useState<Record<Significance, boolean>>({ BREAKING: true, HIGH: true, STANDARD: true });
  const [acctFilter, setAcctFilter] = useState<Record<AccountType, boolean>>({ military: true, government: true, journalist: true, analyst: true, official: true });
  const [pharosOnly, setPharosOnly] = useState(false);
  const { defaultLayout, onLayoutChanged } = usePanelLayout({ id: 'signals' });

  const filtered = useMemo(() => X_POSTS.filter(p => {
    if (!sigFilter[p.significance as Significance])       return false;
    if (!acctFilter[p.accountType as AccountType])        return false;
    if (pharosOnly && !p.pharosNote)                      return false;
    return true;
  }), [sigFilter, acctFilter, pharosOnly]);

  const breaking = filtered.filter(p => p.significance === 'BREAKING');
  const high     = filtered.filter(p => p.significance === 'HIGH');
  const standard = filtered.filter(p => p.significance === 'STANDARD');

  return (
    <ResizablePanelGroup orientation="horizontal" defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} className="flex-1 min-w-0">
      <ResizablePanel id="filters" defaultSize={22} minSize={15} maxSize={35} className="flex flex-col overflow-hidden">
        <SignalFilterRail
        sigFilter={sigFilter}
        acctFilter={acctFilter}
        pharosOnly={pharosOnly}
        totalShown={filtered.length}
        totalAll={X_POSTS.length}
        onSigChange={(s, v) => setSigFilter(p => ({ ...p, [s]: v }))}
        onAcctChange={(a, v) => setAcctFilter(p => ({ ...p, [a]: v }))}
        onPharosOnly={setPharosOnly}
      />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="content" defaultSize={78} minSize={50} className="flex flex-col overflow-hidden">
        <div className="panel-header">
          <span className="section-title">Field Signals — Operation Epic Fury</span>
          <span className="label ml-auto text-[var(--t4)]">PHAROS-CURATED</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 py-3">
            {breaking.length > 0 && (
              <div className="mb-5">
                <SectionHeader label="BREAKING" count={breaking.length} color="var(--danger)" />
                {breaking.map(p => <XPostCard key={p.id} post={p as XPost} />)}
              </div>
            )}
            {high.length > 0 && (
              <div className="mb-5">
                <SectionHeader label="HIGH SIGNIFICANCE" count={high.length} color="var(--warning)" />
                {high.map(p => <XPostCard key={p.id} post={p as XPost} />)}
              </div>
            )}
            {standard.length > 0 && (
              <div className="mb-5">
                <SectionHeader label="STANDARD" count={standard.length} color="var(--info)" />
                {standard.map(p => <XPostCard key={p.id} post={p as XPost} />)}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="p-[60px] text-center">
                <span className="text-[24px] text-[var(--t3)]">𝕏</span>
                <p className="label text-[var(--t3)] mt-3">No signals match current filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
