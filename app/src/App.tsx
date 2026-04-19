import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import DocsLayout from "./pages/DocsLayout";
import DocsHome from "./pages/DocsHome";
import MarkdownPage from "./pages/MarkdownPage";
import ErrorBoundary from "@/components/ErrorBoundary";


const queryClient = new QueryClient();

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
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/questionnaire" element={<Index />} />
              <Route path="/docs" element={<DocsLayout />}>
                <Route index element={<DocsHome />} />
                <Route path="*" element={<ErrorBoundary><MarkdownPage /></ErrorBoundary>} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
