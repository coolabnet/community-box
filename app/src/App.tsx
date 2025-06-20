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


const queryClient = new QueryClient();

const App = () => {
  // Use basename for GitHub Pages deployment
  const basename = import.meta.env.MODE === 'production' ? '/community-box' : '';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/questionnaire" element={<Index />} />
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<DocsHome />} />

              <Route path="*" element={<MarkdownPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
