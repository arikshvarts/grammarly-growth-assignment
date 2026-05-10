import React from 'react';
import fs from 'fs';
import path from 'path';
import { DashboardClient } from '@/components/dashboard-client';

export default async function DashboardPage() {
  const outputDir = path.join(process.cwd(), 'public', 'data');

  const read = (file: string) => {
    try {
      return fs.readFileSync(path.join(outputDir, file), 'utf8');
    } catch {
      return '';
    }
  };

  return (
    <DashboardClient
      userFunnelCsv={read('user_funnel.csv')}
      cohortCsv={read('cohort_metrics.csv')}
      dailyCsv={read('daily_event_metrics.csv')}
      featureCsv={read('feature_metrics.csv')}
    />
  );
}
