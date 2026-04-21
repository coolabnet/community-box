import { lazy, Suspense, useState, useMemo, type ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DocsLayout from "./pages/DocsLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Wraps a dynamic import so that chunk-load failures can be retried.
 * React.lazy caches rejected imports, so ErrorBoundary "Try Again" would
 * re-throw the cached failure. This helper uses a module-level counter as
 * a key — when the ErrorBoundary resets, the counter increments, React
 * unmounts the old lazy component and mounts a fresh one that re-attempts
 * the import.
 *
 * Browsers cache failed dynamic imports by module specifier, so retrying
 * with a fresh lazy() wrapper alone doesn't bypass the cache. After
 * MAX_RETRIES failed attempts, we fall back to a full page reload, which
 * fetches fresh HTML referencing fresh chunks — the same approach used by
 * Next.js and other frameworks.
 */
const MAX_RETRIES = 2;

const retryableLazy = <T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) => {
  let retryCount = 0;
  const Component = (props: React.ComponentProps<T>) => {
    const [count, setCount] = useState(retryCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- count is intentionally used to trigger lazy() recreation on retry
    const LazyComp = useMemo(() => lazy(factory), [count]);
    const handleReset = () => {
      retryCount++;
      if (retryCount > MAX_RETRIES) {
        window.location.reload();
        return;
      }
      setCount(retryCount);
    };
    return (
      <ErrorBoundary onReset={handleReset} resetLabel="Try Again">
        <LazyComp {...(props as Record<string, unknown>)} />
      </ErrorBoundary>
    );
  };
  return Component;
};

const LandingPage = retryableLazy(() => import("./pages/LandingPage"));
const Index = retryableLazy(() => import("./pages/Index"));
const DocsHome = retryableLazy(() => import("./pages/DocsHome"));
const MarkdownPage = retryableLazy(() => import("./pages/MarkdownPage"));


const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/questionnaire" element={<Index />} />
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<DocsHome />} />
        <Route path="*" element={<MarkdownPage key={location.pathname} />} />
      </Route>
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Read router basename from environment, fall back to empty string
  const basename = import.meta.env.VITE_ROUTER_BASENAME || '';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter basename={basename}>
            <Suspense fallback={<LoadingSpinner />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
