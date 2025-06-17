import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
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

type MenuItem = {
  title: string;
  to?: string;         // internal docs path (no ".md")
  href?: string;       // external
  icon?: React.ReactNode;
  children?: MenuItem[];
};

// Create menu function that accepts dynamic PDF URL
const createMenu = (pdfUrl: string): MenuItem[] => [
  {
    title: '🧭 Hardware Questionnaire',
    icon: <HardDrive size={16} />,
    href: '/questionnaire'
  },
  {
    title: '📄 Download Research Paper',
    icon: <FileText size={16} />,
    href: pdfUrl
  },
  {
    title: '💿 Download Images',
    icon: <Download size={16} />,
    children: [
      {
        title: 'Operating Systems (x86)',
        children: [
          { title: 'YunoHost-x86_64-v11.2.iso', href: '#' },
          { title: 'Caprover-ubuntu-x86_64-v2.iso', href: '#' },
          { title: 'CasaOS-debian-x86_64-v0.4.8.img', href: '#' }
        ]
      },
      {
        title: 'Operating Systems (ARM64)',
        children: [
          { title: 'YunoHost-rpi-arm64-v11.2.img', href: '#' },
          { title: 'Caprover-ubuntu-arm64-v2.img', href: '#' },
          { title: 'CasaOS-rpi-arm64-v0.4.8.img', href: '#' }
        ]
      },
      {
        title: 'Networking',
        children: [
          { title: 'LibreMesh Image Finder', href: 'https://libremesh.org' }
        ]
      }
    ]
  },
  {
    title: '📚 Quickstart Guides',
    icon: <BookOpen size={16} />,
    children: [
      {
        title: '🖥️ Hardware Guides',
        children: [
          {
            title: 'Intel NUC',
            children: [
              { title: 'nuc-models-comparison.md', to: 'hardware/intel_nuc/nuc-models-comparison' },
              { title: 'nuc-overview.md', to: 'hardware/intel_nuc/nuc-overview' },
              { title: 'nuc-bios-setup.md', to: 'hardware/intel_nuc/nuc-bios-setup' },
              { title: 'nuc-troubleshooting.md', to: 'hardware/intel_nuc/nuc-troubleshooting' }
            ]
          },
          {
            title: 'Raspberry Pi',
            children: [
              { title: 'rpi-models-comparison.md', to: 'hardware/raspberry_pi_5/rpi-models-comparison' },
              { title: 'rpi-overview.md', to: 'hardware/raspberry_pi_5/rpi-overview' },
              { title: 'rpi-cooling-power.md', to: 'hardware/raspberry_pi_5/rpi-cooling-power' },
              { title: 'rpi-troubleshooting.md', to: 'hardware/raspberry_pi_5/rpi-troubleshooting' }
            ]
          },
          {
            title: 'ZimaBoard',
            children: [
              { title: 'zima-models-comparison.md', to: 'hardware/zimaboard/zima-models-comparison' },
              { title: 'zima-overview.md', to: 'hardware/zimaboard/zima-overview' },
              { title: 'zima-expansion-options.md', to: 'hardware/zimaboard/zima-expansion-options' },
              { title: 'zima-troubleshooting.md', to: 'hardware/zimaboard/zima-troubleshooting' }
            ]
          },
          {
            title: 'Recycled Computer',
            children: [
              { title: 'recycled-models-comparison.md', to: 'guides/recycled-models-comparison' },
              { title: 'recycled-pc-requirements.md', to: 'guides/recycled-pc-requirements' },
              { title: 'recycled-preparation.md', to: 'guides/recycled-preparation' },
              { title: 'hardware-compatibility-check.md', to: 'guides/hardware-compatibility-check' }
            ]
          }
        ]
      },
      {
        title: '💻 Software Platforms',
        children: [
          { title: 'yunohost-overview.md', to: 'software/yunohost/README' },
          { title: 'caprover-overview.md', to: 'software/caprover/README' },
          { title: 'casaos-overview.md', to: 'software/casaos/README' }
        ]
      },
      {
        title: '🔧 Essential Services',
        children: [
          {
            title: 'Content Distribution',
            children: [
              { title: 'local-media-server.md', to: 'guides/local-media-server' },
              { title: 'educational-content-repo.md', to: 'guides/educational-content-repo' },
              { title: 'app-cache-setup.md', to: 'guides/app-cache-setup' }
            ]
          },
          {
            title: 'Communication Tools',
            children: [
              { title: 'chat-server-setup.md', to: 'guides/chat-server-setup' },
              { title: 'video-conferencing.md', to: 'guides/video-conferencing' },
              { title: 'community-forum.md', to: 'guides/community-forum' }
            ]
          },
          {
            title: 'Network Services',
            children: [
              { title: 'captive-portal-config.md', to: 'guides/captive-portal-config' },
              { title: 'bandwidth-management.md', to: 'guides/bandwidth-management' },
              { title: 'user-authentication.md', to: 'guides/user-authentication' },
              { title: 'usage-monitoring.md', to: 'guides/usage-monitoring' }
            ]
          },
          {
            title: 'Local Services',
            children: [
              { title: 'iot-gateway-setup.md', to: 'guides/iot-gateway-setup' },
              { title: 'community-dashboard.md', to: 'guides/community-dashboard' },
              { title: 'accounting-system.md', to: 'guides/accounting-system' }
            ]
          }
        ]
      },
      {
        title: '🌐 Network Configuration',
        children: [
          {
            title: 'LibreMesh Integration',
            children: [
              { title: 'captive-portal-guide.md', to: 'guides/captive-portal-guide' },
              { title: 'mesh-network-basics.md', to: 'guides/mesh-network-basics' },
              { title: 'dns-configuration.md', to: 'guides/dns-configuration' }
            ]
          },
          {
            title: 'Router Setup',
            children: [
              { title: 'router-selection-guide.md', to: 'guides/router-selection-guide' },
              { title: 'libremesh-installation.md', to: 'guides/libremesh-installation' }
            ]
          }
        ]
      },
      {
        title: '🛠️ System Management',
        children: [
          { title: 'etcher-guide.md', to: 'guides/etcher-guide' },
          { title: 'disk-partitioning.md', to: 'guides/disk-partitioning' },
          { title: 'external-storage.md', to: 'guides/external-storage' },
          { title: 'server-maintenance.md', to: 'guides/server-maintenance' },
          { title: 'network-maintenance.md', to: 'guides/network-maintenance' },
          { title: 'security-best-practices.md', to: 'guides/security-best-practices' }
        ]
      },
      {
        title: '📖 Case Stories',
        children: [
          { title: 'rural-school-network.md', to: 'guides/rural-school-network' },
          { title: 'island-community-mesh.md', to: 'guides/island-community-mesh' },
          { title: 'urban-neighborhood-portal.md', to: 'guides/urban-neighborhood-portal' },
          { title: 'refugee-camp-connectivity.md', to: 'guides/refugee-camp-connectivity' }
        ]
      }
    ]
  },
  {
    title: '☀️ Solar Calculator',
    icon: <Sun size={16} />,
    href: 'https://solar.coolab.org/'
  },
  {
    title: '🌍 Community',
    icon: <Users size={16} />,
    children: [
      { title: 'Interactive Map', to: 'results/global-community-networks-directory' },
      { title: 'community-directory.json', href: '/research/results/community-directory.json' },
      { title: 'join-community-form.md', to: 'guides/join-community-form' }
    ]
  },
  {
    title: 'ℹ️ About',
    icon: <Info size={16} />,
    to: 'presentation/about'
  }
];

interface SidebarMenuProps {
  isOpen?: boolean;
  onToggle?: () => void;
  showToggleButton?: boolean;
}

export default function SidebarMenu({ isOpen = false, onToggle, showToggleButton = true }: SidebarMenuProps) {
  const isMobile = useIsMobile();
  const [pdfUrl, setPdfUrl] = useState('https://github.com/coolabnet/community-box/releases/latest');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const { pathname } = useLocation();

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
  useEffect(() => {
    if (isMobile && onToggle && isOpen) {
      onToggle();
    }
  }, [pathname]); // Remove isMobile, onToggle, isOpen from dependencies

  const shouldShow = isOpen;

  return (
    <>
      {showToggleButton && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg lg:hidden"
          onClick={onToggle}
        >
          {isOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      )}

      <AnimatePresence>
        {shouldShow && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 w-80 bg-background border-r p-4 overflow-y-auto z-40 shadow-lg"
            style={{
              top: pathname === '/questionnaire' ? '73px' : '0',
              height: pathname === '/questionnaire' ? 'calc(100vh - 73px)' : '100vh'
            }}
          >
            <Link to="/" className="mb-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-primary rounded-full text-primary-foreground">
                <Wifi size={20} />
              </div>
              <span className="font-bold text-lg">Community Box</span>
            </Link>

            <div className="space-y-2">
              {menu.map((item, index) => (
                <MenuItem key={index} item={item} level={0} />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {isMobile && isOpen && onToggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}

function MenuItem({ item, level }: { item: MenuItem; level: number }) {
  const hasChildren = !!item.children?.length;
  const [expanded, setExpanded] = useState(false);
  const paddingLeft = `${(level + 1) * 12}px`;

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
            <span className="text-sm font-medium">{item.title}</span>
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
          <span>{item.title}</span>
        </div>
      </a>
    );
  }

  if (item.to) {
    return (
      <Link
        to={`/docs/${item.to}`}
        className="block py-2 px-2 rounded hover:bg-secondary/50 hover:text-primary transition-colors text-sm"
        style={{ paddingLeft }}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <span>{item.title}</span>
        </div>
      </Link>
    );
  }

  return null;
}
