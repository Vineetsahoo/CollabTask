import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  ListTodo,
  Kanban,
  Workflow,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  Users
} from 'lucide-react';
import { cn } from '../utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isNew?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const modernNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'taskboard', label: 'Kanban Board', icon: <Kanban size={18} /> },
  { id: 'tasklist', label: 'Task List', icon: <ListTodo size={18} />, badge: 12 },
  { id: 'workflows', label: 'Workflows', icon: <Workflow size={18} />, isNew: true },
  { id: 'chat', label: 'Team Chat', icon: <MessageSquare size={18} />, badge: 3 },
  { id: 'timetracking', label: 'Time Tracking', icon: <Clock size={18} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={18} /> },
];

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> },
];

export default function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-neutral-100",
          "flex flex-col shadow-xl",
          "lg:static lg:!translate-x-0 lg:shadow-none lg:z-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 flex items-center justify-center">
              <img src="/src/download.svg" alt="Collab Task Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-neutral-900">
                Collab Task
              </h1>
              <p className="text-xs text-neutral-500 font-medium">Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile - at top of main content */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-neutral-50 to-white hover:shadow-md transition-all cursor-pointer border border-neutral-100">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Profile"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                Amanda
              </p>
              <p className="text-xs text-neutral-500 truncate">
                amanda@collabtask...
              </p>
            </div>
            <ChevronRight size={16} className="text-neutral-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-0.5">
            {modernNavItems.slice(0, 1).map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  onClose();
                }}
              />
            ))}
          </div>
          
          {/* Divider */}
          <div className="h-px bg-neutral-200 my-3"></div>
          
          <div className="space-y-0.5">
            {modernNavItems.slice(1).map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  onClose();
                }}
              />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-3 border-t border-neutral-100">
          <div className="space-y-0.5">
            {bottomNavItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>

        {/* Team Members Preview */}
        <div className="px-4 py-4 bg-gradient-to-br from-neutral-50 to-white border-t border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Team Members
            </span>
            <span className="text-xs text-neutral-500 font-medium">5 online</span>
          </div>
          <div className="flex items-center -space-x-2">
            {[
              'https://images.unsplash.com/photo-1494790108755-2616b612400e?w=150',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            ].map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Team member ${index + 1}`}
                className="w-8 h-8 rounded-full border-2 border-white object-cover hover:scale-110 hover:z-10 transition-transform cursor-pointer"
              />
            ))}
            <button className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-full border-2 border-white flex items-center justify-center transition-colors">
              <Users size={14} className="text-neutral-600" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
        isActive
          ? "bg-blue-50 text-neutral-900 shadow-sm"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      <div className={cn(
        "flex-shrink-0 transition-all duration-200",
        isActive ? "text-neutral-700" : "text-neutral-400"
      )}>
        {item.icon}
      </div>
      <span className={cn(
        "flex-1 text-sm truncate transition-all",
        isActive ? "font-semibold" : "font-medium"
      )}>
        {item.label}
      </span>
      
      {/* Badge */}
      {item.badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold min-w-[20px] text-center">
          {item.badge}
        </span>
      )}
      
      {/* New Badge */}
      {item.isNew && (
        <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2.5 py-0.5 rounded-md font-bold">
          New
        </span>
      )}
    </motion.button>
  );
}