'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Users } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { usePanelLayout } from '@/hooks/use-panel-layout';
import { ACTORS } from '@/data/iranActors';
import { ActorList } from '@/components/actors/ActorList';
import { ActorDossier } from '@/components/actors/ActorDossier';
import { EmptyState } from '@/components/shared/EmptyState';

function ActorsInner() {
  const searchParams = useSearchParams();
  const initActor    = searchParams.get('actor');

  const [selId, setSelId] = useState<string | null>(initActor);
  const [tab,   setTab]   = useState<'intel' | 'signals'>('intel');
  const { defaultLayout, onLayoutChanged } = usePanelLayout({ id: 'actors' });

  useEffect(() => { if (initActor) setSelId(initActor); }, [initActor]);

  const selected = ACTORS.find(a => a.id === selId) ?? null;

  return (
    <ResizablePanelGroup orientation="horizontal" defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} className="flex-1 min-w-0">
      <ResizablePanel id="list" defaultSize={25} minSize={15} maxSize={40} className="flex flex-col overflow-hidden">
        <ActorList
          selectedId={selId}
          onSelect={id => { setSelId(id); if (id) setTab('intel'); }}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="dossier" defaultSize={75} minSize={40} className="flex flex-col overflow-hidden">
        {selected
          ? <ActorDossier actor={selected} tab={tab} onTabChange={setTab} />
          : <EmptyState icon={Users} message="Select an actor" />
        }
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default function ActorsPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center"><span className="label">Loading…</span></div>}>
      <ActorsInner />
    </Suspense>
  );
}
