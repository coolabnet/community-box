import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, HardDrive, Settings, Network, Users, FileText } from 'lucide-react';

type QuickLinkSection = {
  titleKey: string;
  descKey: string;
  icon: ReactNode;
  links: { titleKey?: string; title?: string; to: string }[];
};

const quickLinks: QuickLinkSection[] = [
  {
    titleKey: 'docsHome.sections.hardware.title',
    descKey: 'docsHome.sections.hardware.description',
    icon: <HardDrive className="h-8 w-8" />,
    links: [
      { titleKey: 'docsHome.links.rpiOverview', to: '/docs/hardware/raspberry_pi_5/rpi-overview' },
      { titleKey: 'docsHome.links.nucOverview', to: '/docs/hardware/intel_nuc/nuc-overview' },
      { titleKey: 'docsHome.links.zimaOverview', to: '/docs/hardware/zimaboard/zima-overview' }
    ]
  },
  {
    titleKey: 'docsHome.sections.software.title',
    descKey: 'docsHome.sections.software.description',
    icon: <Settings className="h-8 w-8" />,
    // Product names: kept as plain text, not translated
    links: [
      { title: 'YunoHost', to: '/docs/software/yunohost/README' },
      { title: 'CapRover', to: '/docs/software/caprover/README' },
      { title: 'CasaOS', to: '/docs/software/casaos/README' }
    ]
  },
  {
    titleKey: 'docsHome.sections.network.title',
    descKey: 'docsHome.sections.network.description',
    icon: <Network className="h-8 w-8" />,
    links: [
      { titleKey: 'docsHome.links.libremeshOverview', to: '/docs/guides/libremesh-overview' },
      { titleKey: 'docsHome.links.meshBasics', to: '/docs/guides/mesh-network-basics' },
      { titleKey: 'docsHome.links.routerSetup', to: '/docs/guides/router-selection-guide' }
    ]
  },
  {
    titleKey: 'docsHome.sections.community.title',
    descKey: 'docsHome.sections.community.description',
    icon: <Users className="h-8 w-8" />,
    links: [
      { titleKey: 'docsHome.links.communityMap', to: '/docs/directory' },
      { titleKey: 'docsHome.links.globalNetworks', to: '/docs/results/global-community-networks-directory' }
    ]
  }
];

export default function DocsHome() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('docsHome.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('docsHome.subtitle')}
        </p>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6 mb-12"
      >
        {quickLinks.map((section, index) => (
          <motion.div
            key={section.titleKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-blue-600">
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {t(section.titleKey)}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t(section.descKey)}
            </p>
            <div className="space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  → {link.titleKey ? t(link.titleKey) : link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Featured Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          {t('docsHome.featured')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('docsHome.cards.paper.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('docsHome.cards.paper.description')}
            </p>
            <a
              href="https://github.com/coolabnet/community-box/releases/latest/download/CCCI_Comparative_Study_2024.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              {t('docsHome.cards.paper.cta')} →
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('docsHome.cards.solar.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('docsHome.cards.solar.description')}
            </p>
            <a
              href="https://solar.coolab.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              {t('docsHome.cards.solar.cta')} →
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('docsHome.cards.prep.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('docsHome.cards.prep.description')}
            </p>
            <Link
              to="/docs/guides/recycled-preparation"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              {t('docsHome.cards.prep.cta')} →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
