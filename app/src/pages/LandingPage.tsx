import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SidebarMenu from '@/components/SidebarMenu';
import { Wifi, Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import bannerImage from '../assets/banner.png';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStart = () => {
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center z-50 relative">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('common.toggleSidebar')}
          >
            {sidebarOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Wifi className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl">{t('common.communityBox')}</span>
        </motion.div>

        {/* Language Switcher */}
        <div className="z-50">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Sidebar Menu - overlay mode on all screen sizes */}
      {sidebarOpen && (
        <SidebarMenu
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          showToggleButton={false}
          forceOverlay={true}
        />
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-4xl mx-auto flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Image */}
          <motion.div
            className="w-full mb-8 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={bannerImage}
              alt={t('landing.altHeroImage')}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('landing.title')}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-center text-muted-foreground mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t('landing.description')}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="px-12 py-6 text-xl rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                onClick={handleStart}
              >
                {t('landing.startButton')}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="px-12 py-6 text-xl rounded-full shadow-lg border-2"
                onClick={() => navigate('/docs')}
              >
                📚 {t('landing.browseGuides')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Explainer */}
          <motion.section
            aria-labelledby="landing-explainer-heading"
            className="w-full max-w-2xl mt-12 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2
              id="landing-explainer-heading"
              className="text-2xl font-bold text-foreground mb-3"
            >
              {t('landing.explainer.heading')}
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              {t('landing.explainer.intro')}
            </p>
            <Accordion type="multiple" className="w-full border-t">
              <AccordionItem value="what-is">
                <AccordionTrigger className="text-left text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t('landing.explainer.whatTitle')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('landing.explainer.whatBody')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="what-tool-does">
                <AccordionTrigger className="text-left text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t('landing.explainer.toolTitle')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('landing.explainer.toolBody')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="can-cannot">
                <AccordionTrigger className="text-left text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t('landing.explainer.canTitle')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('landing.explainer.canBody')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="help">
                <AccordionTrigger className="text-left text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t('landing.explainer.helpTitle')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <Trans
                    i18nKey="landing.explainer.helpBody"
                    components={{
                      guides: (
                        <Link
                          to="/docs"
                          className="text-primary underline underline-offset-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      ),
                      directory: (
                        <Link
                          to="/docs/directory"
                          className="text-primary underline underline-offset-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      ),
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.section>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {t('landing.footer')}</p>
      </div>
    </div>
  );
};

export default LandingPage;
