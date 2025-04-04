import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Plus,
  Edit,
  Trash2,
  LineChart,
  Settings,
  Tag,
  Folder
} from 'lucide-react';

// Add TypeScript interfaces
interface TimeEntry {
  id: string;
  task: string;
  project: string;
  startTime: string;
  endTime: string | null;
  duration: string;
  status: 'active' | 'completed';
}

interface EditableTimeEntry extends TimeEntry {
  durationDisplay: string;
}

const TimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: 'e1',
      task: 'API integration',
      project: 'Backend Development',
      startTime: '2025-06-10T09:00:00',
      endTime: '2025-06-10T11:30:00',
      duration: '2h 30m',
      status: 'completed'
    },
    {
      id: 'e2',
      task: 'Design new landing page',
      project: 'Website Redesign',
      startTime: '2025-06-10T13:00:00',
      endTime: '2025-06-10T15:45:00',
      duration: '2h 45m',
      status: 'completed'
    },
    {
      id: 'e3',
      task: 'Fix payment gateway bug',
      project: 'Backend Development',
      startTime: '2025-06-10T16:00:00',
      endTime: null,
      duration: '0h 0m',
      status: 'active'
    }
  ]);

  const [isTracking, setIsTracking] = useState(true);
  const [activeTask, setActiveTask] = useState('Fix payment gateway bug');
  const [activeProject, setActiveProject] = useState('Backend Development');
  const [timer, setTimer] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Add new state for modals
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showEditEntry, setShowEditEntry] = useState(false);
  const [currentEditEntry, setCurrentEditEntry] = useState<EditableTimeEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    task: '',
    project: '',
    startTime: '',
    endTime: '',
    duration: ''
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTracking(!isTracking);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTimer(0);
    
    // Update the active time entry
    const updatedEntries = timeEntries.map(entry => {
      if (entry.status === 'active') {
        return {
          ...entry,
          endTime: new Date().toISOString(),
          duration: '2h 15m', // This would be calculated in a real app
          status: 'completed' as const
        };
      }
      return entry;
    });
    
    setTimeEntries(updatedEntries);
    startNewTracking(); // Start a new tracking session after stopping
  };

  const startNewTracking = () => {
    // Create a new time entry
    const newEntry: TimeEntry = {
      id: `e${timeEntries.length + 1}`,
      task: activeTask,
      project: activeProject,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: '0h 0m',
      status: 'active' as const
    };
    
    setTimeEntries([...timeEntries, newEntry]);
    setIsTracking(true);
    setTimer(0);
  };

  // Add timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Add new functions for analytics
  const getAnalytics = () => {
    const totalHours = timeEntries.reduce((acc, entry) => {
      const duration = entry.duration.split('h')[0];
      return acc + parseInt(duration);
    }, 0);

    const projectDistribution = timeEntries.reduce((acc: Record<string, number>, entry) => {
      acc[entry.project] = (acc[entry.project] || 0) + 1;
      return acc;
    }, {});

    return {
      totalHours,
      totalEntries: timeEntries.length,
      projectDistribution
    };
  };

  // Add new function for settings
  const handleSettingsUpdate = (settings: { notifications: boolean, autoStopTimer: boolean }) => {
    // Implementation for settings update
    console.log('Settings updated:', settings);
    setShowSettings(false);
  };

  // Add new function for manual time entry
  const handleAddTimeEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: TimeEntry = {
      id: `e${timeEntries.length + 1}`,
      ...newEntry,
      status: 'completed' as const
    };
    setTimeEntries([...timeEntries, entry]);
    setShowAddEntry(false);
    setNewEntry({
      task: '',
      project: '',
      startTime: '',
      endTime: '',
      duration: ''
    });
  };

  // Fix the edit functions with proper type annotations
  const handleEditEntry = (entry: TimeEntry) => {
    // Calculate duration for display in the form
    let durationValue = entry.duration;
    if (entry.startTime && entry.endTime) {
      const start = new Date(entry.startTime);
      const end = new Date(entry.endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      durationValue = `${diffHrs}h ${diffMins}m`;
    }

    setCurrentEditEntry({
      ...entry,
      startTime: entry.startTime ? entry.startTime.slice(0, 16) : '',
      endTime: entry.endTime ? entry.endTime.slice(0, 16) : '',
      durationDisplay: durationValue
    });
    setShowEditEntry(true);
  };
  
  const handleUpdateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEditEntry) return;
    
    // Calculate duration
    let duration = currentEditEntry.durationDisplay;
    if (currentEditEntry.startTime && currentEditEntry.endTime) {
      const start = new Date(currentEditEntry.startTime);
      const end = new Date(currentEditEntry.endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      duration = `${diffHrs}h ${diffMins}m`;
    }
    
    // Update the entry
    const updatedEntries = timeEntries.map(entry => {
      if (entry.id === currentEditEntry.id) {
        return {
          ...currentEditEntry,
          duration
        } as TimeEntry;
      }
      return entry;
    });
    
    setTimeEntries(updatedEntries);
    setShowEditEntry(false);
    setCurrentEditEntry(null);
  };
  
  // Fix the delete function
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      const updatedEntries = timeEntries.filter(entry => entry.id !== id);
      setTimeEntries(updatedEntries);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Time Tracking</h1>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-green-500" />
              <span>Today's total tracked time: 7h 30m</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto">
            <button 
              onClick={() => setShowAnalytics(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Analytics
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex-1 sm:flex-initial justify-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Timer Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    Task
                  </label>
                  <select
                    className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                    value={activeTask}
                    onChange={(e) => setActiveTask(e.target.value)}
                  >
                    <option>Fix payment gateway bug</option>
                    <option>API integration</option>
                    <option>Design new landing page</option>
                    <option>Update user documentation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Folder className="h-4 w-4 mr-2 text-gray-400" />
                    Project
                  </label>
                  <select
                    className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                    value={activeProject}
                    onChange={(e) => setActiveProject(e.target.value)}
                  >
                    <option>Backend Development</option>
                    <option>Website Redesign</option>
                    <option>Mobile App</option>
                    <option>Documentation</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 font-mono mb-4">
                  {formatTime(timer)}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={toggleTimer}
                    className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-medium transition-all ${
                      isTracking 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isTracking ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </>
                    )}
                  </button>
                  <button
                    onClick={stopTracking}
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entries Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="date"
                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <select className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 sm:flex-none text-sm">
              <option>All Projects</option>
              <option>Backend Development</option>
              <option>Website Redesign</option>
            </select>
          </div>
          <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full self-end sm:self-auto">
            Total: 7h 30m
          </span>
        </div>

        {/* Time Entries */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <ul className="divide-y divide-gray-100 min-w-[640px]">
              {timeEntries.map((entry) => (
                <li key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                        entry.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">{entry.task}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{entry.project}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs sm:text-sm text-gray-500 mr-4 sm:mr-6 hidden sm:block">
                        {entry.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span>
                            {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Running'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-16 text-right">
                        {entry.duration}
                      </div>
                      <div className="ml-2 sm:ml-4 flex-shrink-0 flex">
                        <button 
                          className="mr-1 sm:mr-2 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <span className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">Showing {timeEntries.length} entries</span>
            <button
              onClick={() => setShowAddEntry(true)}
              className="inline-flex w-full sm:w-auto justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors order-1 sm:order-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Entry
            </button>
          </div>
        </div>
      </div>

      {/* Add Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Time Tracking Analytics</h2>
            <div className="space-y-4">
              {Object.entries(getAnalytics()).map(([key, value]) => (
                <div key={key} className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  {key === 'projectDistribution' ? (
                    <div className="space-y-2">
                      {Object.entries(value as Record<string, number>).map(([project, count]) => (
                        <div key={project} className="flex justify-between">
                          <span>{project}</span>
                          <span>{count} entries</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{value.toString()}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAnalytics(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Time Tracking Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-blue-500" />
                <span className="text-sm">Enable notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-blue-500" />
                <span className="text-sm">Auto-stop timer after 8 hours</span>
              </label>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Default project</label>
                <select className="w-full rounded-lg border-gray-200 text-sm">
                  <option>Backend Development</option>
                  <option>Website Redesign</option>
                  <option>Mobile App</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:space-x-3 gap-2 sm:gap-0">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSettingsUpdate({ notifications: true, autoStopTimer: true })}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:ml-2"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add Time Entry</h2>
            <form onSubmit={handleAddTimeEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task</label>
                <input
                  type="text"
                  required
                  value={newEntry.task}
                  onChange={e => setNewEntry({...newEntry, task: e.target.value})}
                  className="w-full rounded-lg border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  required
                  value={newEntry.project}
                  onChange={e => setNewEntry({...newEntry, project: e.target.value})}
                  className="w-full rounded-lg border-gray-200 text-sm"
                >
                  <option value="">Select a project</option>
                  <option>Backend Development</option>
                  <option>Website Redesign</option>
                  <option>Mobile App</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEntry.startTime}
                    onChange={e => setNewEntry({...newEntry, startTime: e.target.value})}
                    className="w-full rounded-lg border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEntry.endTime}
                    onChange={e => setNewEntry({...newEntry, endTime: e.target.value})}
                    className="w-full rounded-lg border-gray-200 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEntry(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Time Entry Modal */}
      {showEditEntry && currentEditEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Time Entry</h2>
            <form onSubmit={handleUpdateEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task</label>
                <input
                  type="text"
                  required
                  value={currentEditEntry.task}
                  onChange={e => setCurrentEditEntry({...currentEditEntry, task: e.target.value})}
                  className="w-full rounded-lg border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  required
                  value={currentEditEntry.project}
                  onChange={e => setCurrentEditEntry({...currentEditEntry, project: e.target.value})}
                  className="w-full rounded-lg border-gray-200 text-sm"
                >
                  <option>Backend Development</option>
                  <option>Website Redesign</option>
                  <option>Mobile App</option>
                  <option>Documentation</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={currentEditEntry.startTime}
                    onChange={e => setCurrentEditEntry({...currentEditEntry, startTime: e.target.value})}
                    className="w-full rounded-lg border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={currentEditEntry.endTime || ''}
                    onChange={e => setCurrentEditEntry({...currentEditEntry, endTime: e.target.value})}
                    className="w-full rounded-lg border-gray-200 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditEntry(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;