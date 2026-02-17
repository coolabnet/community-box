import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarMenu from '@/components/SidebarMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Menu as MenuIcon, X as CloseIcon, Wifi } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function DocsLayout() {
  const isMobile = useIsMobile();
  // Sidebar starts closed on mobile, always open on desktop
  // Note: This only checks on initial render - for resize handling, mobile toggle works
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen">
      {/* Desktop: side-by-side layout with sidebar always visible */}
      <div className="hidden lg:flex min-h-screen">
        <SidebarMenu
          isOpen={true}
          onToggle={handleSidebarToggle}
          showToggleButton={false}
        />
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Left - logo */}
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Community Box</span>
                </Link>
              </div>
              <LanguageSwitcher />
            </div>
          </header>
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile: overlay layout */}
      <div className="lg:hidden flex h-screen overflow-hidden">
        <SidebarMenu
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          showToggleButton={false}
        />
        <main className="flex-1 overflow-auto bg-gray-50/50 transition-all duration-300">
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Left - logo and menu toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSidebarToggle}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
                </button>
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Community Box</span>
                </Link>
              </div>
              <LanguageSwitcher />
            </div>
          </header>
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
