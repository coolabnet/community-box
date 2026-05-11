import React, { type ComponentType, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RetryableLazyOptions {
  /** Display name shown in React DevTools. Defaults to "RetryableLazy". */
  name?: string;
  /** Number of retries before page reload. Default 2. */
  maxRetries?: number;
}

/**
 * Wraps a React.lazy() component with:
 * - ErrorBoundary with automatic retry
 * - Suspense with a simple fallback
 * - displayName for React DevTools
 */
export function retryableLazy<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options?: RetryableLazyOptions,
): () => JSX.Element {
  const LazyComponent = React.lazy(importFn);
  const name = options?.name ?? 'RetryableLazy';
  const maxRetries = options?.maxRetries ?? 2;

  const Wrapped = () => {
    const [retryCount, setRetryCount] = React.useState(0);

    const handleRetry = () => {
      setRetryCount((c) => {
        const next = c + 1;
        if (next > maxRetries) {
          window.location.reload();
          return c;
        }
        return next;
      });
    };

    return (
      <ErrorBoundary
        key={retryCount}
        onRetry={handleRetry}
        onError={(error) => console.error(`[${name}] Chunk load error:`, error)}
      >
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
          <LazyComponent />
        </Suspense>
      </ErrorBoundary>
    );
  };

  Wrapped.displayName = `retryableLazy(${name})`;
  return Wrapped;
}
