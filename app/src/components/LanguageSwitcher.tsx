import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <div className="relative">
        {/* Dropdown trigger button */}
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{currentLanguage.name}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </motion.button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full mt-2 right-0 w-36 bg-background/95 backdrop-blur-sm rounded-md shadow-lg border border-border overflow-hidden"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-1">
                <div className="py-1 px-2 text-xs font-medium text-muted-foreground border-b border-border mb-1">
                  {t('language.select')}
                </div>
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    className={cn(
                      "flex w-full items-center px-2 py-1.5 text-sm rounded-sm transition-colors",
                      i18n.language === lang.code
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-foreground"
                    )}
                    onClick={() => changeLanguage(lang.code)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {lang.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
