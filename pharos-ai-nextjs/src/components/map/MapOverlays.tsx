'use client';

import Link from 'next/link';
import { X, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoryIcon from './StoryIcon';

import type { MapStory } from '@/data/mapStories';

// ─── Back button ──────────────────────────────────────────────────────────────

function BackButton() {
  return (
    <Link
      href="/dashboard"
      className="mono"
      style={{
        position:   'absolute',
        top:        12,
        left:       12,
        background: 'var(--blue)',
        color:      'var(--t1)',
        padding:    '6px 12px',
        fontSize:   10,
        fontWeight: 700,
        borderRadius: 2,
        textDecoration: 'none',
        display:    'inline-block',
        zIndex:     10,
        letterSpacing: '0.06em',
      }}
    >
      ← BACK TO OVERVIEW
    </Link>
  );
}

// ─── Active story pill ────────────────────────────────────────────────────────

type StoryPillProps = {
  story:   MapStory;
  onClear: () => void;
};

function ActiveStoryPill({ story, onClear }: StoryPillProps) {
  return (
    <div style={{
      position:  'absolute',
      top:       12,
      left:      '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(28,33,39,0.95)',
      border:    '1px solid var(--bd)',
      borderRadius: 2,
      padding:   '6px 12px',
      display:   'flex',
      alignItems: 'center',
      gap:       8,
      zIndex:    10,
    }}>
      <StoryIcon iconName={story.iconName} category={story.category} size={12} boxSize={22} />
      <span className="mono" style={{ fontSize: 11, color: 'var(--t1)', fontWeight: 700 }}>
        STORY: {story.title.toUpperCase()}
      </span>
      <Button variant="ghost" size="sm" onClick={onClear} className="h-5 w-5 p-0" style={{ color: 'var(--t4)' }}>
        <X size={12} strokeWidth={2.5} />
      </Button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Props = {
  activeStory:  MapStory | null;
  onClearStory: () => void;
  sidebarOpen:  boolean;
  onToggleSidebar: () => void;
  embedded?: boolean;
};

export default function MapOverlays({ activeStory, onClearStory, sidebarOpen, onToggleSidebar, embedded = false }: Props) {
  return (
    <>
      {!embedded && <BackButton />}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="mono h-7 px-2"
          style={{
            position:     'absolute',
            top:          12,
            left:         embedded ? 12 : 170,
            background:   'rgba(28,33,39,0.92)',
            border:       '1px solid var(--bd)',
            borderRadius: 2,
            color:        'var(--t3)',
            fontSize:     10,
            fontWeight:   700,
            zIndex:       10,
            display:      'flex',
            alignItems:   'center',
            gap:          4,
          }}
          title="Open stories panel"
        >
          <PanelLeft size={14} strokeWidth={2} />
          STORIES
        </Button>
      )}
      {activeStory && <ActiveStoryPill story={activeStory} onClear={onClearStory} />}
    </>
  );
}
