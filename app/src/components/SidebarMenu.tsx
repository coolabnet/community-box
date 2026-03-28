import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Wifi,
  ChevronDown,
  Menu as MenuIcon,
  X as CloseIcon,
  FileText,
  Download,
  HardDrive,
  BookOpen,
  Sun,
  Users,
  Info
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPdfDownloadUrl } from '@/lib/github';
import { getAllMarkdownTitles, deslugify } from '@/lib/markdown';

type MenuItem = {
  title?: string;       // For dynamic content (markdown titles)
  titleKey?: string;    // For i18n translation keys
  to?: string;         // internal docs path (no ".md")
  href?: string;       // external
  icon?: React.ReactNode;
  children?: MenuItem[];
};

// Get titles at module level (computed once at build time)
const MARKDOWN_TITLES = getAllMarkdownTitles();

// Resolve title from path using frontmatter title or de-slugify fallback
function resolveTitle(path: string): string {
  return MARKDOWN_TITLES[path] || deslugify(path);
}

// Helper function to get display title
function getDisplayTitle(item: MenuItem, t: (key: string) => string): string {
  if (item.titleKey) {
    return t(item.titleKey);
  }
  return item.title || '';
}

// Create menu function that accepts dynamic PDF URL
const createMenu = (pdfUrl: string): MenuItem[] => [
  {
    titleKey: 'sidebar.hardwareQuestionnaire',
    icon: <HardDrive size={16} />,
    to: '/questionnaire'
  },
  {
    titleKey: 'sidebar.downloadResearchPaper',
    icon: <FileText size={16} />,
    href: pdfUrl
  },
  {
    titleKey: 'sidebar.downloadImages',
    icon: <Download size={16} />,
    children: [
      {
        titleKey: 'sidebar.operatingSystemsX86',
        children: [
          // { title: 'YunoHost-x86_64-v11.2.iso', href: '#' },
          // { title: 'Caprover-ubuntu-x86_64-v2.iso', href: '#' },
          // { title: 'CasaOS-debian-x86_64-v0.4.8.img', href: '#' }
          { titleKey: 'common.imagesNotBuiltYet', href: '#' }
        ]
      },
      {
        titleKey: 'sidebar.operatingSystemsARM64',
        children: [
          // { title: 'YunoHost-rpi-arm64-v11.2.img', href: '#' },
          // { title: 'Caprover-ubuntu-arm64-v2.img', href: '#' },
          // { title: 'CasaOS-rpi-arm64-v0.4.8.img', href: '#' }
          { titleKey: 'common.imagesNotBuiltYet', href: '#' }
        ]
      },
      {
        titleKey: 'sidebar.networking',
        children: [
          { title: 'LibreMesh Image Finder', href: 'https://firmware-selector.libremesh.org/' }
        ]
      }
    ]
  },
  {
    titleKey: 'sidebar.quickstartGuides',
    icon: <BookOpen size={16} />,
    children: [
      {
        titleKey: 'sidebar.hardwareGuides',
        children: [
          {
            titleKey: 'sidebar.intelNUC',
            children: [
              { title: resolveTitle('hardware/intel_nuc/nuc-models-comparison'), to: 'hardware/intel_nuc/nuc-models-comparison' },
              { title: resolveTitle('hardware/intel_nuc/nuc-overview'), to: 'hardware/intel_nuc/nuc-overview' },
              { title: resolveTitle('hardware/intel_nuc/nuc-bios-setup'), to: 'hardware/intel_nuc/nuc-bios-setup' },
              { title: resolveTitle('hardware/intel_nuc/nuc-power-network'), to: 'hardware/intel_nuc/nuc-power-network' }
            ]
          },
          {
            titleKey: 'sidebar.raspberryPi',
            children: [
              { title: resolveTitle('hardware/raspberry_pi_5/rpi-models-comparison'), to: 'hardware/raspberry_pi_5/rpi-models-comparison' },
              { title: resolveTitle('hardware/raspberry_pi_5/rpi-overview'), to: 'hardware/raspberry_pi_5/rpi-overview' },
              { title: resolveTitle('hardware/raspberry_pi_5/rpi-cooling-power'), to: 'hardware/raspberry_pi_5/rpi-cooling-power' }
            ]
          },
          {
            titleKey: 'sidebar.zimaBoard',
            children: [
              { title: resolveTitle('hardware/zimaboard/zima-models-comparison'), to: 'hardware/zimaboard/zima-models-comparison' },
              { title: resolveTitle('hardware/zimaboard/zima-overview'), to: 'hardware/zimaboard/zima-overview' },
              { title: resolveTitle('hardware/zimaboard/zima-expansion-options'), to: 'hardware/zimaboard/zima-expansion-options' },
              { title: resolveTitle('hardware/zimaboard/zima-troubleshooting'), to: 'hardware/zimaboard/zima-troubleshooting' }
            ]
          },
          {
            titleKey: 'sidebar.recycledComputer',
            children: [
              { title: resolveTitle('guides/recycled-models-comparison'), to: 'guides/recycled-models-comparison' },
              { title: resolveTitle('guides/recycled-preparation'), to: 'guides/recycled-preparation' },
              { title: resolveTitle('guides/hardware-compatibility-check'), to: 'guides/hardware-compatibility-check' }
            ]
          }
        ]
      },
      {
        titleKey: 'sidebar.softwarePlatforms',
        children: [
          { title: resolveTitle('software/yunohost/README'), to: 'software/yunohost/README' },
          { title: resolveTitle('software/caprover/README'), to: 'software/caprover/README' },
          { title: resolveTitle('software/casaos/README'), to: 'software/casaos/README' },
          { title: resolveTitle('software/balena/README'), to: 'software/balena/README' }
        ]
      },
      {
        titleKey: 'sidebar.essentialServices',
        children: [
          { title: resolveTitle('guides/libremesh-overview'), to: 'guides/libremesh-overview' },
          { title: resolveTitle('guides/mesh-network-basics'), to: 'guides/mesh-network-basics' },
          { title: resolveTitle('guides/dns-configuration'), to: 'guides/dns-configuration' },
          { title: resolveTitle('guides/deployment-best-practices'), to: 'guides/deployment-best-practices' }
        ]
      },
      {
        titleKey: 'sidebar.networkConfiguration',
        children: [
          { title: resolveTitle('guides/router-selection-guide'), to: 'guides/router-selection-guide' },
          { title: resolveTitle('guides/libremesh-installation'), to: 'guides/libremesh-installation' }
        ]
      },
      {
        titleKey: 'sidebar.systemManagement',
        children: [
          { title: resolveTitle('guides/etcher-guide'), to: 'guides/etcher-guide' },
          { title: resolveTitle('guides/disk-partitioning'), to: 'guides/disk-partitioning' },
          { title: resolveTitle('guides/external-storage'), to: 'guides/external-storage' },
          { title: resolveTitle('guides/mini-pc-decision-framework'), to: 'guides/mini-pc-decision-framework' }
        ]
      },
      {
        titleKey: 'sidebar.caseStudies',
        children: [
          { title: resolveTitle('guides/hardware-clustering-analysis'), to: 'guides/hardware-clustering-analysis' },
          { title: resolveTitle('guides/mesh-clustering-analysis'), to: 'guides/mesh-clustering-analysis' }
        ]
      }
    ]
  },
  {
    titleKey: 'sidebar.solarCalculator',
    icon: <Sun size={16} />,
    href: 'https://solar.coolab.org/'
  },
  {
    titleKey: 'sidebar.community',
    icon: <Users size={16} />,
    children: [
      { title: resolveTitle('results/global-community-networks-directory'), to: 'results/global-community-networks-directory' }
    ]
  },
  {
    titleKey: 'sidebar.about',
    icon: <Info size={16} />,
    to: 'about'
  }
];

interface SidebarMenuProps {
  isOpen?: boolean;
  onToggle?: () => void;
  showToggleButton?: boolean;
  forceOverlay?: boolean; // When true, always show as overlay (e.g., landing page)
}

export default function SidebarMenu({ isOpen = false, onToggle, showToggleButton = true, forceOverlay = false }: SidebarMenuProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const [pdfUrl, setPdfUrl] = useState('https://github.com/coolabnet/community-box/releases/latest');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const { pathname } = useLocation();

  // When forceOverlay is true, behave like mobile (overlay mode)
  const useOverlayMode = isMobile || forceOverlay;

  // Debug logging
  if (import.meta.env.DEV) {
    console.log('SidebarMenu render:', { isOpen, isMobile, showToggleButton });
  }

  // Fetch PDF URL on component mount
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = await getPdfDownloadUrl();
        setPdfUrl(url);
      } catch (error) {
        console.error('Failed to fetch PDF URL:', error);
        // Keep default fallback URL
      }
    };

    fetchPdfUrl();
  }, []);

  // Update menu when PDF URL changes
  useEffect(() => {
    setMenu(createMenu(pdfUrl));
  }, [pdfUrl]);

  // Auto-close on route change (mobile) - only when pathname changes
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (useOverlayMode && onToggle && isOpen && pathname !== prevPathname.current) {
      onToggle();
      prevPathname.current = pathname;
    }
    // Always update prevPathname when pathname changes
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
    }
  }, [useOverlayMode, isOpen, onToggle, pathname]);

  // On desktop with overlay mode (forceOverlay), behave like mobile (toggleable overlay)
  // On desktop without overlay, sidebar is always visible in normal flow (side-by-side with content)
  // On mobile, sidebar is always toggleable overlay
  const shouldShow = !useOverlayMode || isOpen;

  // Desktop: render as static sidebar with sticky positioning (only when NOT in overlay mode)
  if (isDesktop && !useOverlayMode && shouldShow) {
    return (
      <nav
        className="sticky top-0 w-80 bg-background border-r p-4 overflow-y-auto"
        style={{
          height: '100vh'
        }}
      >
        <Link to="/" className="mb-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-primary rounded-full text-primary-foreground">
            <Wifi size={20} />
          </div>
          <span className="font-bold text-lg">{t('common.communityBox')}</span>
        </Link>

        <div className="space-y-2">
          {menu.map((item, index) => (
            <MenuItem key={index} item={item} level={0} />
          ))}
        </div>
      </nav>
    );
  }

  // Mobile: render as overlay with animation
  return (
    <>
      {/* Floating toggle button (shown when sidebar is closed and parent doesn't provide one) */}
      {showToggleButton && !isOpen && onToggle && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
          onClick={onToggle}
          aria-label={t('common.openMenu')}
        >
          <MenuIcon size={20} />
        </button>
      )}

      {/* Sidebar - mobile overlay */}
      <AnimatePresence>
        {shouldShow && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 w-80 bg-background border-r p-4 overflow-y-auto z-50 shadow-lg"
            style={{
              top: useOverlayMode ? '0' : '73px',
              height: useOverlayMode ? '100vh' : 'calc(100vh - 73px)'
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="p-2 bg-primary rounded-full text-primary-foreground">
                  <Wifi size={20} />
                </div>
                <span className="font-bold text-lg">{t('common.communityBox')}</span>
              </Link>
              {/* Close button for mobile */}
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                  aria-label={t('common.closeMenu')}
                >
                  <CloseIcon size={20} />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {menu.map((item, index) => (
                <MenuItem key={index} item={item} level={0} />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isOpen && onToggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}

function MenuItem({ item, level }: { item: MenuItem; level: number }) {
  const { t } = useTranslation();
  const hasChildren = !!item.children?.length;
  const [expanded, setExpanded] = useState(false);
  const paddingLeft = `${(level + 1) * 12}px`;
  const displayTitle = getDisplayTitle(item, t);

  if (hasChildren) {
    return (
      <div className="mb-1">
        <div
          className="flex justify-between items-center cursor-pointer py-2 px-2 rounded hover:bg-secondary/50 transition-colors"
          style={{ paddingLeft }}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-sm font-medium">{displayTitle}</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children!.map((child, index) => (
                <MenuItem key={index} item={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.href.startsWith('http') ? '_blank' : undefined}
        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block py-2 px-2 rounded hover:bg-secondary/50 transition-colors text-sm"
        style={{ paddingLeft }}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <span>{displayTitle}</span>
        </div>
      </a>
    );
  }

  if (item.to) {
    // Use absolute paths directly, otherwise prepend /docs/
    const linkPath = item.to.startsWith('/') ? item.to : `/docs/${item.to}`;
    return (
      <Link
        to={linkPath}
        className="block py-2 px-2 rounded hover:bg-secondary/50 hover:text-primary transition-colors text-sm"
        style={{ paddingLeft }}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <span>{displayTitle}</span>
        </div>
      </Link>
    );
  }

  return null;
}
