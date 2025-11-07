import type { NextWebVitalsMetric } from 'next/app';

import { sendToVercelAnalytics } from '@/lib/metrics';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  sendToVercelAnalytics(metric);
}
