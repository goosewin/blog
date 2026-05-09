import { describe, expect, it } from 'vitest';
import {
  getEmailFromBody,
  getResendErrorMessage,
  isDuplicateSubscriberError,
  isValidEmail,
} from './subscription';

describe('subscription validation', () => {
  it('extracts and validates email addresses', () => {
    expect(getEmailFromBody({ email: ' dan@example.com ' })).toBe(
      'dan@example.com'
    );
    expect(getEmailFromBody({ email: 123 })).toBeNull();
    expect(isValidEmail('dan@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  it('normalizes Resend duplicate subscriber errors', () => {
    expect(
      isDuplicateSubscriberError(new Error('Contact already exists'))
    ).toBe(true);
    expect(isDuplicateSubscriberError({ message: 'duplicate contact' })).toBe(
      true
    );
    expect(isDuplicateSubscriberError({ message: 'rate limited' })).toBe(false);
    expect(getResendErrorMessage({ message: 'failed' })).toBe('failed');
  });
});
