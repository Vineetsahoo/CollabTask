import React from 'react';
import { 
  CheckSquare
} from 'lucide-react';

interface SidebarProps {
  navItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  navItems, 
  currentPage, 
  setCurrentPage,
  isOpen,
  onClose
}) => {
  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        flex flex-col bg-slate-50 border-r border-slate-200
      `}
      onClick={() => {
        if (window.innerWidth < 768) {
          onClose();
        }
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-6 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600/10 rounded-xl">
            <CheckSquare className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            CollabTask
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto py-6">
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                ${currentPage === item.id
                  ? 'bg-blue-600/10 text-blue-700'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }
              `}
            >
              <div className={`
                mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200
                ${currentPage === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}
              `}>
                {item.icon}
              </div>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;