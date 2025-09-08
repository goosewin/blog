'use client';

import { useState } from 'react';

interface SubscriptionFormProps {
  className?: string;
}

export default function SubscriptionForm({
  className = '',
}: SubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(
          "Thanks for subscribing! You'll get notified when I publish new posts."
        );
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium mb-2">Subscribe to my blog</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Get notified when I publish new posts.
        <br />
        No spam, just good content from your favorite tech bro.
      </p>

      {status === 'success' ? (
        <div className="text-green-600 dark:text-green-400">{message}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="goose@duck.com"
              required
              disabled={status === 'loading'}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 bg-white dark:bg-[#232323] text-gray-900 dark:text-white disabled:opacity-50 text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:opacity-80 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
