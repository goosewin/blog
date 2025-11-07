import type { NextWebVitalsMetric } from 'next/app';

const ENABLE_DEBUG_LOGS = process.env.NODE_ENV === 'development';
const VERCEL_ANALYTICS_ID = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID;
const VERCEL_VITALS_ENDPOINT = 'https://vitals.vercel-analytics.com/v1/vitals';

function normalizeMetricValue(metric: NextWebVitalsMetric): number {
  if (metric.name === 'CLS') {
    return Math.max(metric.value, 0);
  }

  return metric.value;
}

function getConnectionSpeed(): string | undefined {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  return nav.connection?.effectiveType;
}

function logMetric(metric: NextWebVitalsMetric) {
  if (!ENABLE_DEBUG_LOGS) {
    return;
  }

  const formattedValue =
    metric.name === 'CLS'
      ? metric.value.toFixed(4)
      : Math.round(metric.value * 100) / 100;

  console.info('[web-vitals]', metric.name, formattedValue);
}

export function sendToVercelAnalytics(metric: NextWebVitalsMetric) {
  logMetric(metric);

  if (typeof window === 'undefined' || !VERCEL_ANALYTICS_ID) {
    return;
  }

  const payload = {
    dsn: VERCEL_ANALYTICS_ID,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: normalizeMetricValue(metric),
    speed: getConnectionSpeed(),
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(VERCEL_VITALS_ENDPOINT, body);
    return;
  }

  fetch(VERCEL_VITALS_ENDPOINT, {
    body,
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    if (ENABLE_DEBUG_LOGS) {
      console.warn('[web-vitals] failed to send metric', metric.name, error);
    }
  });
}

export function trackCustomMetric(
  name: string,
  value: number,
  metadata: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined' || !VERCEL_ANALYTICS_ID) {
    return;
  }

  const payload = {
    dsn: VERCEL_ANALYTICS_ID,
    id: `${name}-${Date.now()}`,
    page: window.location.pathname,
    href: window.location.href,
    event_name: name,
    value,
    ...metadata,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(VERCEL_VITALS_ENDPOINT, body);
    return;
  }

  fetch(VERCEL_VITALS_ENDPOINT, {
    body,
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    if (ENABLE_DEBUG_LOGS) {
      console.warn('[web-vitals] failed to send custom metric', name, error);
    }
  });
}
