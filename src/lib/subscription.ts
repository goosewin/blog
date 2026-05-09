export function getEmailFromBody(body: unknown) {
  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return null;
  }

  const email = body.email;
  return typeof email === 'string' ? email.trim() : null;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getResendErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return '';
}

export function isDuplicateSubscriberError(error: unknown) {
  const message = getResendErrorMessage(error).toLowerCase();
  return (
    message.includes('already exists') ||
    message.includes('already subscribed') ||
    message.includes('duplicate') ||
    message.includes('contact already')
  );
}
