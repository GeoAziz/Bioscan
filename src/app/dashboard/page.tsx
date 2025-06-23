'use client';

import VitalsSummary from '@/components/dashboard/vitals-summary';
import HolographicBodyView from '@/components/dashboard/holographic-body-view';
import AlertsPanel from '@/components/dashboard/alerts-panel';
import VitalsTimeline from '@/components/dashboard/vitals-timeline';
import { useState } from 'react';

export default function DashboardPage() {
  const [activePart, setActivePart] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-screen flex-col gap-4 p-4 lg:p-6">
      <header>
        <VitalsSummary />
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 min-h-[400px] lg:min-h-0">
          <HolographicBodyView activePart={activePart} setActivePart={setActivePart} />
        </div>
        <div className="min-h-[300px] lg:min-h-0">
          <AlertsPanel />
        </div>
      </main>

      <footer>
        <VitalsTimeline activePart={activePart} />
      </footer>
    </div>
  );
}
