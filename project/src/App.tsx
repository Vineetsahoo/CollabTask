import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Menu,
  Command
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Components
import Sidebar from './components/Sidebar';

// Pages
import ModernDashboard from './pages/ModernDashboard';
import ModernTaskBoard from './pages/ModernTaskBoard';
import ModernTaskList from './pages/ModernTaskList';
import Workflows from './pages/ModernWorkflows';
import Chat from './pages/ModernChat';
import TimeTracking from './pages/ModernTimeTracking';
import Reports from './pages/ModernReports';

// Electron API types
declare global {
  interface Window {
    electronAPI?: {
      onMenuNewTask: (callback: () => void) => void;
      onMenuSettings: (callback: () => void) => void;
      onMenuNavigate: (callback: (event: any, page: string) => void) => void;
      removeAllListeners: (channel: string) => void;
      showNotification: (title: string, body: string) => void;
      requestNotificationPermission: () => Promise<string>;
      platform: string;
    };
    nodeAPI?: {
      platform: string;
      arch: string;
      versions: any;
    };
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check if running in Electron
  useEffect(() => {
    // Request notification permission if in Electron
    if (window.electronAPI) {
      window.electronAPI.requestNotificationPermission();
    }
  }, []);

  // Setup Electron menu listeners
  useEffect(() => {
    if (!window.electronAPI) return;

    const handleNewTask = () => {
      // Handle new task creation
      setCurrentPage('tasklist');
      window.electronAPI?.showNotification('CollabTask', 'Ready to create a new task!');
    };

    const handleSettings = () => {
      // Handle settings
      console.log('Settings opened from menu');
    };

    const handleNavigate = (_event: any, page: string) => {
      setCurrentPage(page);
    };

    // Set up listeners
    window.electronAPI.onMenuNewTask(handleNewTask);
    window.electronAPI.onMenuSettings(handleSettings);
    window.electronAPI.onMenuNavigate(handleNavigate);

    // Cleanup
    return () => {
      window.electronAPI?.removeAllListeners('menu-new-task');
      window.electronAPI?.removeAllListeners('menu-settings');
      window.electronAPI?.removeAllListeners('menu-navigate');
    };
  }, []);

  const navItems: any[] = [];

  const renderPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    const pageTransition = {
      type: "spring",
      stiffness: 400,
      damping: 40
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          {(() => {
            switch (currentPage) {
              case 'dashboard':
                return <ModernDashboard />;
              case 'taskboard':
                return <ModernTaskBoard />;
              case 'tasklist':
                return <ModernTaskList />;
              case 'workflows':
                return <Workflows />;
              case 'chat':
                return <Chat />;
              case 'timetracking':
                return <TimeTracking />;
              case 'reports':
                return <Reports />;
              default:
                return <ModernDashboard />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/20">
      {/* Sidebar */}
      <Sidebar 
        navItems={navItems}
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-100 z-30 sticky top-0 shadow-sm">
          <div className="px-6 py-3.5 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>
              
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center space-x-3 px-4 py-2.5 bg-neutral-100/80 hover:bg-neutral-100 rounded-xl transition-all min-w-[300px] text-left shadow-sm"
                >
                  <Search size={17} className="text-neutral-400" />
                  <span className="text-neutral-500 text-sm font-medium">Search...</span>
                  <div className="ml-auto flex items-center space-x-1">
                    <kbd className="px-2 py-1 text-xs bg-white rounded-lg border border-neutral-200 font-semibold text-neutral-600 shadow-sm">
                      ⌘K
                    </kbd>
                  </div>
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors relative">
                  <Bell size={20} className="text-neutral-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-2.5 pl-2 ml-2 border-l border-neutral-200">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                    alt="Profile"
                    className="w-9 h-9 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-brand-400 transition-all shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-large border border-neutral-200 overflow-hidden">
                <div className="flex items-center px-6 py-4 border-b border-neutral-200">
                  <Search size={20} className="text-neutral-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search tasks, projects, people..."
                    className="flex-1 text-lg placeholder-neutral-400 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex items-center space-x-2 text-xs text-neutral-500">
                    <kbd className="px-2 py-1 bg-neutral-100 rounded">↑↓</kbd>
                    <span>to navigate</span>
                    <kbd className="px-2 py-1 bg-neutral-100 rounded">↵</kbd>
                    <span>to select</span>
                    <kbd className="px-2 py-1 bg-neutral-100 rounded">esc</kbd>
                    <span>to close</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto p-4">
                  <div className="text-center text-neutral-500 py-8">
                    <Command size={48} className="mx-auto text-neutral-300 mb-4" />
                    <p>Start typing to search...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#262626',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;