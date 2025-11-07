'use client';

import { Loader2 } from 'lucide-react';
import { useId, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';

interface SubscriptionFormProps {
  className?: string;
}

type SubscriptionStatus = 'idle' | 'success' | 'error';

const successCopy =
  "Thanks for subscribing! You'll be first to know about new posts.";
const errorCopy = 'Something went wrong. Please try again in a few moments.';

const emailPattern = /.+@.+\..+/;

export default function SubscriptionForm({
  className = '',
}: SubscriptionFormProps) {
  const inputId = useId();
  const messageId = `${inputId}-status`;

  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    if (!emailPattern.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    startTransition(async () => {
      try {
        setStatus('idle');
        setMessage('');

        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(successCopy);
          setEmail('');
        } else {
          setStatus('error');
          setMessage(data?.error ?? errorCopy);
        }
      } catch {
        setStatus('error');
        setMessage(errorCopy);
      }
    });
  };

  return (
    <Card
      className={cn(
        'backdrop-blur supports-[backdrop-filter]:bg-surface/85',
        className
      )}
      aria-labelledby={`${inputId}-heading`}
    >
      <CardHeader>
        <CardTitle id={`${inputId}-heading`}>
          Subscribe to the newsletter
        </CardTitle>
        <CardDescription>
          Join the flock to receive fresh articles, behind-the-scenes
          experiments, and personal updates. No noise—just signal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
          aria-describedby={message ? messageId : undefined}
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="flex flex-col gap-2">
              <label
                htmlFor={inputId}
                className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
              >
                Email address
              </label>
              <Input
                id={inputId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={status === 'error'}
                aria-describedby={message ? messageId : undefined}
                disabled={isPending}
                placeholder="you@getgoosemail.com"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              size="md"
              className="sm:self-end"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Subscribing…
                </span>
              ) : (
                'Join now'
              )}
            </Button>
          </div>

          <p
            id={messageId}
            role="status"
            aria-live="polite"
            className={cn(
              'text-sm',
              status === 'success'
                ? 'text-emerald-600 dark:text-emerald-400'
                : status === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-[var(--color-text-muted)]'
            )}
          >
            {status === 'success' || status === 'error' ? message : ''}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
