import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, HardDrive, Settings, Network, Users, FileText } from 'lucide-react';

const quickLinks = [
  {
    title: 'Hardware Guides',
    description: 'Setup guides for Raspberry Pi, Intel NUC, ZimaBoard, and recycled computers',
    icon: <HardDrive className="h-8 w-8" />,
    links: [
      { title: 'Raspberry Pi Overview', to: '/docs/hardware/raspberry_pi_5/rpi-overview' },
      { title: 'Intel NUC Overview', to: '/docs/hardware/intel_nuc/nuc-overview' },
      { title: 'ZimaBoard Overview', to: '/docs/hardware/zimaboard/zima-overview' }
    ]
  },
  {
    title: 'Software Platforms',
    description: 'Community server platforms: YunoHost, CapRover, and CasaOS',
    icon: <Settings className="h-8 w-8" />,
    links: [
      { title: 'YunoHost', to: '/docs/software/yunohost/README' },
      { title: 'CapRover', to: '/docs/software/caprover/README' },
      { title: 'CasaOS', to: '/docs/software/casaos/README' }
    ]
  },
  {
    title: 'Network Configuration',
    description: 'LibreMesh integration and mesh networking basics',
    icon: <Network className="h-8 w-8" />,
    links: [
      { title: 'LibreMesh Overview', to: '/docs/guides/libremesh-overview' },
      { title: 'Mesh Network Basics', to: '/docs/guides/mesh-network-basics' },
      { title: 'Router Setup', to: '/docs/guides/router-selection-guide' }
    ]
  },
  {
    title: 'Community Resources',
    description: 'Case studies, community directory, and collaboration tools',
    icon: <Users className="h-8 w-8" />,
    links: [
      { title: 'Global Community Networks', to: '/docs/results/global-community-networks-directory' },
      { title: 'Rural School Network Case', to: '/docs/guides/rural-school-network' },
      { title: 'Island Community Mesh', to: '/docs/guides/island-community-mesh' }
    ]
  }
];

export default function DocsHome() {
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
          Community Box Documentation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guides for building community networks with local servers,
          mesh networking, and sustainable technology solutions.
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
            key={section.title}
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
                {section.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {section.description}
            </p>
            <div className="space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  → {link.title}
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
          Featured Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Research Paper</h3>
            <p className="text-gray-600 text-sm mb-3">
              Comprehensive comparative study of community server platforms
            </p>
            <a
              href="https://github.com/coolabnet/community-box/releases/latest/download/CCCI_Comparative_Study_2024.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              Download PDF →
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Solar Calculator</h3>
            <p className="text-gray-600 text-sm mb-3">
              Calculate power requirements for off-grid deployments
            </p>
            <a
              href="https://solar.coolab.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              Open Calculator →
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Hardware Preparation</h3>
            <p className="text-gray-600 text-sm mb-3">
              Step-by-step guide for preparing recycled computers
            </p>
            <Link
              to="/docs/guides/recycled-preparation"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              Read Guide →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
