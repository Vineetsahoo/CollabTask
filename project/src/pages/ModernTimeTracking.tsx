import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square,
  Clock, 
  Calendar, 
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Folder,
  Search,
  Download,
  Timer,
  TrendingUp,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import type { TimeEntry, Task } from '../types';

interface TimeEntryWithDisplay extends TimeEntry {
  durationDisplay: string;
}

const ModernTimeTracking: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithDisplay[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [activeEntry, setActiveEntry] = useState<TimeEntryWithDisplay | null>(null);
  const [timer, setTimer] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');
  
  // Mock data
  const mockProjects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'Backend API' }
  ];

  const mockTasks = [
    { id: '1', title: 'Login Page Design', project: { id: '1', name: 'Website Redesign' } },
    { id: '2', title: 'User Authentication', project: { id: '3', name: 'Backend API' } },
    { id: '3', title: 'Navigation Component', project: { id: '2', name: 'Mobile App' } }
  ];

  // Initialize with some mock entries
  useEffect(() => {
    const mockEntries: TimeEntryWithDisplay[] = [
      {
        id: '1',
        task: mockTasks[0] as Task,
        user: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'member', status: 'online' },
        description: 'Working on login page design',
        startTime: new Date('2025-07-12T09:00:00'),
        endTime: new Date('2025-07-12T11:30:00'),
        duration: 150, // 2.5 hours in minutes
        isRunning: false,
        createdAt: new Date('2025-07-12T09:00:00'),
        durationDisplay: '2h 30m'
      },
      {
        id: '2',
        task: mockTasks[1] as Task,
        user: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'member', status: 'online' },
        description: 'API endpoint development',
        startTime: new Date('2025-07-12T13:00:00'),
        endTime: new Date('2025-07-12T15:45:00'),
        duration: 165, // 2h 45m in minutes
        isRunning: false,
        createdAt: new Date('2025-07-12T13:00:00'),
        durationDisplay: '2h 45m'
      }
    ];
    setTimeEntries(mockEntries);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && activeEntry) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, activeEntry]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const startTracking = () => {
    const newEntry: TimeEntryWithDisplay = {
      id: `entry_${Date.now()}`,
      task: mockTasks[0] as Task,
      user: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'member', status: 'online' },
      description: 'New time entry',
      startTime: new Date(),
      duration: 0,
      isRunning: true,
      createdAt: new Date(),
      durationDisplay: '0h 0m'
    };
    
    setActiveEntry(newEntry);
    setIsTracking(true);
    setTimer(0);
    toast.success('Time tracking started');
  };

  const stopTracking = () => {
    if (activeEntry) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - activeEntry.startTime.getTime()) / 60000);
      
      const completedEntry: TimeEntryWithDisplay = {
        ...activeEntry,
        endTime,
        duration,
        isRunning: false,
        durationDisplay: formatDuration(duration)
      };
      
      setTimeEntries(prev => [completedEntry, ...prev]);
      setActiveEntry(null);
      setIsTracking(false);
      setTimer(0);
      toast.success('Time tracking stopped');
    }
  };

  const deleteEntry = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
    toast.success('Time entry deleted');
  };

  // Filter and search entries
  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = filterProject === 'all' || entry.task.project.id === filterProject;
    
    const entryDate = new Date(entry.startTime).toISOString().split('T')[0];
    const matchesDate = entryDate === selectedDate;
    
    return matchesSearch && matchesProject && matchesDate;
  });

  // Calculate stats
  const totalDuration = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">Time Tracking</h1>
                  <p className="text-sm text-neutral-600">Track your time and productivity</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              
              <button 
                onClick={() => setShowAnalytics(true)}
                className="inline-flex items-center px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </button>
              
              <button 
                onClick={() => setShowAddEntry(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Timer Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Current Session</h2>
              <div className="text-4xl font-bold font-mono">
                {formatTime(timer)}
              </div>
              {activeEntry && (
                <p className="text-green-100 mt-2">{activeEntry.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!isTracking ? (
                <button
                  onClick={startTracking}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Play className="h-5 w-5" />
                  Start Timer
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsTracking(!isTracking);
                      toast.info(isTracking ? 'Timer paused' : 'Timer resumed');
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {isTracking ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={stopTracking}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Square className="h-5 w-5" />
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}h {totalMinutes}m</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Timer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entries</p>
                <p className="text-2xl font-bold text-gray-900">{filteredEntries.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">{mockProjects.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productivity</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search time entries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {mockProjects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Time Entries */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Time Entries</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredEntries.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries</h3>
                <p className="text-gray-500 mb-6">Start tracking your time to see entries here.</p>
                <button 
                  onClick={startTracking}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Tracking
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${entry.isRunning ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {entry.isRunning ? (
                          <Play className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{entry.task.title}</h3>
                        <p className="text-sm text-gray-600">{entry.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {entry.task.project.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.startTime).toLocaleTimeString()} - {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'Running'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900">
                        {entry.durationDisplay}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => toast.info('Edit feature coming soon!')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Edit entry"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Add Time Entry</h2>
              <p className="text-gray-600 mb-6">Manual time entry feature coming soon!</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddEntry(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernTimeTracking;
