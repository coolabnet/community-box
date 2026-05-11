import React, { type ComponentType, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RetryableLazyOptions {
  /** Display name shown in React DevTools. Defaults to "RetryableLazy". */
  name?: string;
}

/**
 * Detects chunk-load failures (dynamic import() errors) which browsers cache
 * by module specifier, making retry with the same import URL a no-op.
 */
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    /loading (css |chunk |module )?failed/i.test(error.message) ||
    /dynamically imported module/i.test(error.message)
  );
}

/**
 * Wraps a React.lazy() component with:
 * - ErrorBoundary that detects chunk-load failures and offers "Reload Page"
 * - Suspense with a simple fallback
 * - displayName for React DevTools
 *
 * For chunk-load errors (network failures during code splitting), the browser
 * caches the failed import() by module specifier, so retrying with the same
 * factory always re-fails. We detect these and show "Reload Page" as the
 * primary action instead of a misleading "Try Again" button.
 */
export function retryableLazy<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options?: RetryableLazyOptions,
): () => JSX.Element {
  const LazyComponent = React.lazy(importFn);
  const name = options?.name ?? 'RetryableLazy';

  const Wrapped = () => {
    const [chunkError, setChunkError] = React.useState(false);

    const handleError = (error: Error) => {
      console.error(`[${name}] Load error:`, error);
      if (isChunkLoadError(error)) {
        setChunkError(true);
      }
    };

    // For chunk-load errors, bypass ErrorBoundary retry and show reload UI
    if (chunkError) {
      return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
          <div className="bg-card border border-border rounded-xl shadow-sm max-w-md w-full p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Failed to load
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              A required component could not be loaded. This is usually caused by a network issue or after an update.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (
      <ErrorBoundary
        onRetry={() => window.location.reload()}
        onError={handleError}
        resetLabel="Reload Page"
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
