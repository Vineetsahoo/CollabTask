import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Clock, 
  BarChart2, 
  Menu,
  Bell,
  Search
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';
import TaskList from './pages/TaskList';
import Workflows from './pages/Workflows';
import Chat from './pages/Chat';
import TimeTracking from './pages/TimeTracking';
import Reports from './pages/Reports';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Users size={20} /> },
    { id: 'taskboard', label: 'Kanban Board', icon: <CheckSquare size={20} /> },
    { id: 'tasklist', label: 'Task List', icon: <CheckSquare size={20} /> },
    { id: 'workflows', label: 'Workflows', icon: <Calendar size={20} /> },
    { id: 'chat', label: 'Team Chat', icon: <MessageSquare size={20} /> },
    { id: 'timetracking', label: 'Time Tracking', icon: <Clock size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart2 size={20} /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'taskboard':
        return <TaskBoard />;
      case 'tasklist':
        return <TaskList />;
      case 'workflows':
        return <Workflows />;
      case 'chat':
        return <Chat />;
      case 'timetracking':
        return <TimeTracking />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle overlay click
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        navItems={navItems} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 text-xl font-bold text-indigo-600">CollabTask</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search"
                />
              </div>
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;