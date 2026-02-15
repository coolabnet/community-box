import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarMenu from '@/components/SidebarMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';

export default function DocsLayout() {
  const isMobile = useIsMobile();
  // On desktop, sidebar is always open; on mobile, it's closed by default
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    console.log('Toggling sidebar, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen">
      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:flex">
        <SidebarMenu
          isOpen={true}
          onToggle={handleSidebarToggle}
          showToggleButton={false}
        />
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Empty - sidebar has logo */}
              <div></div>
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
              {/* Empty - sidebar has logo and menu toggle */}
              <div></div>
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
