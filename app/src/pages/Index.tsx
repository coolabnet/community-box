
import { useState } from 'react';
import { QuestionnaireProvider } from '@/context/QuestionnaireContext';
import Questionnaire from '@/components/Questionnaire';
import SidebarMenu from '@/components/SidebarMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Menu as MenuIcon, X as CloseIcon, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QuestionnaireProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Header with burger menu and language switcher */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left side - Burger menu and title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
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

        <div className="flex min-h-[calc(100vh-73px)]">
          {/* Sidebar Menu - overlay mode on all screen sizes */}
          <SidebarMenu
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            showToggleButton={false}
            forceOverlay={true}
          />

          {/* Main content */}
          <main className="flex-1 transition-all duration-300">
            <div className="w-full">
              <Questionnaire />
            </div>
          </main>
        </div>
      </div>
    </QuestionnaireProvider>
  );
};

export default Index;
