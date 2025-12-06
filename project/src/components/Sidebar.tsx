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
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'taskboard', label: 'Kanban Board', icon: <Kanban size={20} /> },
  { id: 'tasklist', label: 'Task List', icon: <ListTodo size={20} />, badge: 12 },
  { id: 'workflows', label: 'Workflows', icon: <Workflow size={20} />, isNew: true },
  { id: 'chat', label: 'Team Chat', icon: <MessageSquare size={20} />, badge: 3 },
  { id: 'timetracking', label: 'Time Tracking', icon: <Clock size={20} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
];

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> },
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200",
          "flex flex-col shadow-large",
          "lg:static lg:!translate-x-0 lg:shadow-none lg:z-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-neutral-900">
                CollabTask
              </h1>
              <p className="text-xs text-neutral-500">Team Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                alt="Profile"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                Alex Johnson
              </p>
              <p className="text-xs text-neutral-500 truncate">
                alex@collabtask.com
              </p>
            </div>
            <ChevronRight size={16} className="text-neutral-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {modernNavItems.map((item) => (
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
        <div className="p-4 border-t border-neutral-200">
          <div className="space-y-1">
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
        <div className="p-4 bg-neutral-50 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-600 uppercase tracking-wide">
              Team Members
            </span>
            <span className="text-xs text-neutral-500">5 online</span>
          </div>
          <div className="flex -space-x-2">
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
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
            <div className="w-8 h-8 bg-neutral-200 rounded-full border-2 border-white flex items-center justify-center">
              <Users size={14} className="text-neutral-600" />
            </div>
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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
        isActive
          ? "bg-brand-50 text-brand-700 shadow-sm"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      <div className={cn(
        "flex-shrink-0",
        isActive ? "text-brand-600" : "text-neutral-400"
      )}>
        {item.icon}
      </div>
      <span className="flex-1 font-medium text-sm truncate">
        {item.label}
      </span>
      
      {/* Badge */}
      {item.badge && (
        <span className={cn(
          "badge text-xs px-2 py-0.5 rounded-full",
          isActive
            ? "bg-brand-100 text-brand-700"
            : "bg-neutral-100 text-neutral-600"
        )}>
          {item.badge}
        </span>
      )}
      
      {/* New Badge */}
      {item.isNew && (
        <span className="badge bg-accent-100 text-accent-700 text-xs px-2 py-0.5 rounded-full">
          New
        </span>
      )}
    </motion.button>
  );
}