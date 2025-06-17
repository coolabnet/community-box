import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarMenu from '@/components/SidebarMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu as MenuIcon, Wifi } from 'lucide-react';

export default function DocsLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    console.log('Toggling sidebar, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarMenu
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        showToggleButton={false}
      />

      <main className="flex-1 overflow-auto bg-gray-50/50 transition-all duration-300">
        {/* Header with Burger Menu and Language Switcher */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Burger menu and title */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSidebarToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <MenuIcon size={20} />
              </button>

              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Wifi className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg hidden sm:block">Community Box</span>
              </Link>
            </div>

            {/* Right side - Language switcher */}
            <LanguageSwitcher />
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
