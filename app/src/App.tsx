import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DocsLayout from "./pages/DocsLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { retryableLazy } from "@/lib/retryableLazy";

const LandingPage = retryableLazy(() => import("./pages/LandingPage"), { name: 'LandingPage' });
const Index = retryableLazy(() => import("./pages/Index"), { name: 'Index' });
const DocsHome = retryableLazy(() => import("./pages/DocsHome"), { name: 'DocsHome' });
const MarkdownPage = retryableLazy(() => import("./pages/MarkdownPage"), { name: 'MarkdownPage' });

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
  // Derive basename from Vite's base config (set to '/community-box/' in production).
  // VITE_ROUTER_BASENAME can override if needed. Strip trailing slash for React Router.
  const basename = import.meta.env.VITE_ROUTER_BASENAME
    || import.meta.env.BASE_URL.replace(/\/+$/, '')
    || '';

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
