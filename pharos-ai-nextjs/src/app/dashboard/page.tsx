'use client';

import { SummaryBar } from '@/components/overview/SummaryBar';
import { WorkspaceDashboard } from '@/components/dashboard/WorkspaceDashboard';

export default function OverviewPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[var(--bg-1)]">
      <SummaryBar />
      <WorkspaceDashboard />
    </div>
  );
}
