import type { IdempotentRequest, PostOptions } from 'resend';

// Resend's public PostOptions type omits `signal`, but `Resend.post` forwards
// it into fetch. Idempotency-Key is typed via IdempotentRequest.
export type ResendRequestOptions = PostOptions &
  IdempotentRequest & {
    signal?: AbortSignal;
  };
