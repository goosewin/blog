export type NewsletterSendResult = {
  broadcastId: string;
  reused: boolean;
};

type InFlightOperation = {
  promise: Promise<NewsletterSendResult>;
};

const completedOperations = new Map<string, NewsletterSendResult>();
const inFlightOperations = new Map<string, InFlightOperation>();

export function getCompletedNewsletterOperation(requestId: string) {
  return completedOperations.get(requestId);
}

export async function runExclusiveNewsletterOperation(
  requestId: string,
  execute: () => Promise<NewsletterSendResult>
) {
  const completed = completedOperations.get(requestId);
  if (completed) return completed;

  const inFlight = inFlightOperations.get(requestId);
  if (inFlight) return inFlight.promise;

  const promise = execute().then((result) => {
    completedOperations.set(requestId, result);
    return result;
  });

  inFlightOperations.set(requestId, { promise });

  try {
    return await promise;
  } finally {
    inFlightOperations.delete(requestId);
  }
}

export async function findBroadcastIdByName(
  listPage: (cursor?: string) => Promise<{
    items: Array<{ id: string; name: string }>;
    hasMore: boolean;
  }>,
  name: string
) {
  let cursor: string | undefined;

  for (;;) {
    const page = await listPage(cursor);
    const match = page.items.find((item) => item.name === name);
    if (match) return match.id;
    if (!page.hasMore || page.items.length === 0) return null;
    cursor = page.items.at(-1)?.id;
    if (!cursor) return null;
  }
}
