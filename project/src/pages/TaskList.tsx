import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  CheckSquare,
  Users,
  BarChart2,
  Calendar,
  ArrowUpRight,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

interface TaskReport {
  totalTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  upcomingDeadlines: number;
}

interface UserProfile {
  name: string;
  image: string;
}

const TaskList: React.FC = () => {
  const userProfiles: Record<string, UserProfile> = {
    'Rahul Sharma': {
      name: 'Rahul Sharma',
      image: ''
    },
    'Priya Patel': {
      name: 'Priya Patel',
      image: ''
    },
    'Ananya Desai': {
      name: 'Ananya Desai',
      image: ''
    },
    'Vikram Singh': {
      name: 'Vikram Singh',
      image: ''
    },
    'Neha Gupta': {
      name: 'Neha Gupta',
      image: ''
    },
    'Arjun Kumar': {
      name: 'Arjun Kumar',
      image: ''
    },
    'Anil Reddy': {
      name: 'Anil Reddy',
      image: ''
    },
    'Meera Iyer': {
      name: 'Meera Iyer',
      image: ''
    }
  };

  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 't1', 
      title: 'Research competitor products', 
      description: 'Analyze top 5 competitor products and create a comparison report',
      assignee: 'Rahul Sharma',
      dueDate: '2025-06-15',
      status: 'To Do',
      priority: 'Medium',
      completed: false
    },
    { 
      id: 't2', 
      title: 'Update user documentation', 
      description: 'Update the user guide with new features from the latest release',
      assignee: 'Priya Patel',
      dueDate: '2025-06-18',
      status: 'To Do',
      priority: 'Low',
      completed: false
    },
    { 
      id: 't3', 
      title: 'Design new landing page', 
      description: 'Create wireframes and mockups for the new marketing landing page',
      assignee: 'Ananya Desai',
      dueDate: '2025-06-20',
      status: 'To Do',
      priority: 'High',
      completed: false
    },
    { 
      id: 't4', 
      title: 'API integration', 
      description: 'Integrate payment gateway API with the checkout process',
      assignee: 'Vikram Singh',
      dueDate: '2025-06-14',
      status: 'In Progress',
      priority: 'High',
      completed: false
    },
    { 
      id: 't5', 
      title: 'Fix payment gateway bug', 
      description: 'Investigate and fix the payment processing error on mobile devices',
      assignee: 'Neha Gupta',
      dueDate: '2025-06-12',
      status: 'In Progress',
      priority: 'High',
      completed: false
    },
    { 
      id: 't6', 
      title: 'Implement user feedback form', 
      description: 'Add a feedback collection form to the dashboard',
      assignee: 'Arjun Kumar',
      dueDate: '2025-06-10',
      status: 'In Review',
      priority: 'Medium',
      completed: false
    },
    { 
      id: 't7', 
      title: 'Create weekly analytics report', 
      description: 'Generate and distribute the weekly performance analytics report',
      assignee: 'Anil Reddy',
      dueDate: '2025-06-05',
      status: 'Done',
      priority: 'Medium',
      completed: true
    },
    { 
      id: 't8', 
      title: 'Update privacy policy', 
      description: 'Review and update the privacy policy to comply with new regulations',
      assignee: 'Meera Iyer',
      dueDate: '2025-06-01',
      status: 'Done',
      priority: 'Low',
      completed: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState({
    assignee: '',
    startDate: '',
    endDate: '',
    hasAttachments: false,
    hasComments: false,
  });
  const [newTaskForm, setNewTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignee: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'To Do',
    priority: 'Medium',
    completed: false
  });

  const toggleTaskCompletion = (taskId: string): void => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const applyAdvancedFilters = (task: Task) => {
    const matchesAssignee = !filters.assignee || task.assignee.toLowerCase().includes(filters.assignee.toLowerCase());
    const matchesDateRange = (!filters.startDate || new Date(task.dueDate) >= new Date(filters.startDate)) &&
                           (!filters.endDate || new Date(task.dueDate) <= new Date(filters.endDate));
    
    return matchesAssignee && matchesDateRange;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesAdvancedFilters = applyAdvancedFilters(task);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAdvancedFilters;
  });

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-purple-100 text-purple-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.src = 'https://via.placeholder.com/256';
  };

  const generateReport = (): TaskReport => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      highPriorityTasks: tasks.filter(t => t.priority === 'High').length,
      upcomingDeadlines: tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= now && dueDate <= weekFromNow;
      }).length
    };
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `t${Date.now()}`,
      ...newTaskForm as Omit<Task, 'id'>
    };
    setTasks([...tasks, newTask]);
    setShowNewTaskModal(false);
    setNewTaskForm({
      title: '',
      description: '',
      assignee: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'To Do',
      priority: 'Medium',
      completed: false
    });
  };

  const resetFilters = () => {
    setFilters({
      assignee: '',
      startDate: '',
      endDate: '',
      hasAttachments: false,
      hasComments: false,
    });
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  const handleMoreOptions = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const options = [
      {
        label: 'Edit Task',
        action: () => handleEditTask(task)
      },
      {
        label: 'Delete Task',
        action: () => handleDeleteTask(taskId)
      },
      {
        label: task.completed ? 'Mark as Incomplete' : 'Mark as Complete',
        action: () => toggleTaskCompletion(taskId)
      },
      {
        label: 'Copy Task Link',
        action: () => {
          navigator.clipboard.writeText(`task/${taskId}`);
          toast.success('Task link copied to clipboard');
        }
      }
    ];

    const choice = window.confirm(
      `Choose an action for "${task.title}": \n` +
      options.map((opt, i) => `${i + 1}. ${opt.label}`).join('\n')
    );
    if (choice) {
      options[0].action();
    }
  };

  const handleCalendarClick = (date: string) => {
    const taskDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(taskDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    toast.success(
      diffDays === 0 ? 'Due today!' :
      taskDate < today ? `Overdue by ${diffDays} days` :
      `Due in ${diffDays} days`
    );
  };

  const handleUserClick = (assignee: string) => {
    const userProfile = userProfiles[assignee];
    if (userProfile) {
      toast.success(`Viewing ${assignee}'s profile`, {
        icon: '👤'
      });
    }
  };

  const handleSearchIconClick = () => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleEditTask = (task: Task) => {
    setNewTaskForm(task);
    setShowNewTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  const handleBarChartClick = () => {
    setShowReportModal(true);
  };

  const handleSlidersClick = () => {
    setShowFiltersModal(true);
  };

  const handlePlusClick = () => {
    setShowNewTaskModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tasks</h1>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{tasks.length} total tasks</span>
            <span className="mx-2">•</span>
            <span>{tasks.filter(t => t.completed).length} completed</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 self-stretch sm:self-auto mt-4 sm:mt-0">
          <button 
            onClick={handleBarChartClick}
            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            title="View Reports"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Reports</span>
          </button>
          <button 
            onClick={handlePlusClick}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex-1 sm:flex-initial justify-center"
            title="Create New Task"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-grow">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={handleSearchIconClick}
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              className="pl-2 sm:pl-3 pr-8 sm:pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm flex-1 sm:flex-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>In Review</option>
              <option>Done</option>
            </select>
            <select
              className="pl-2 sm:pl-3 pr-8 sm:pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm flex-1 sm:flex-none"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button 
              onClick={handleSlidersClick}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center"
              title="Advanced Filters"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredTasks.map((task) => (
            <li key={task.id} className="group hover:bg-gray-50 transition-colors">
              <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-start sm:items-center space-x-3">
                    <button 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`
                        flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-md border transition-colors mt-0.5 sm:mt-0
                        ${task.completed 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'border-gray-300 hover:border-blue-500'}
                      `}
                    >
                      {task.completed && <CheckSquare className="h-4 w-4" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-8 sm:ml-0">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap sm:flex-nowrap items-center justify-between text-sm gap-2">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleUserClick(task.assignee)}
                    >
                      <img
                        className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover ring-2 ring-white hover:ring-blue-500 transition-colors"
                        src={userProfiles[task.assignee]?.image || 'https://via.placeholder.com/256'}
                        alt={task.assignee}
                        onError={handleImageError}
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 truncate max-w-[80px] sm:max-w-none">
                        {task.assignee}
                      </span>
                    </div>
                    <div 
                      className="flex items-center text-gray-500 cursor-pointer"
                      onClick={() => handleCalendarClick(task.dueDate)}
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 hover:text-blue-500" />
                      <span className="text-xs sm:text-sm">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMoreOptions(task.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                    title="More Options"
                  >
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <span className="text-xs sm:text-sm text-gray-600">Showing {filteredTasks.length} of {tasks.length} tasks</span>
            <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center self-end">
              View All Tasks
              <ArrowUpRight className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Task Report</h2>
            <div className="space-y-4">
              {Object.entries(generateReport()).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowReportModal(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {newTaskForm.id ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTaskForm.description}
                  onChange={e => setNewTaskForm({...newTaskForm, description: e.target.value})}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assignee</label>
                <input
                  type="text"
                  value={newTaskForm.assignee}
                  onChange={e => setNewTaskForm({...newTaskForm, assignee: e.target.value})}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={newTaskForm.dueDate}
                    onChange={e => setNewTaskForm({...newTaskForm, dueDate: e.target.value})}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={e => setNewTaskForm({...newTaskForm, priority: e.target.value as Task['priority']})}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  {newTaskForm.id ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Advanced Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  placeholder="Filter by assignee..."
                  value={filters.assignee}
                  onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.hasAttachments}
                    onChange={(e) => setFilters({...filters, hasAttachments: e.target.checked})}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-gray-600">Has attachments</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.hasComments}
                    onChange={(e) => setFilters({...filters, hasComments: e.target.checked})}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-gray-600">Has comments</span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-6">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 order-1 sm:order-none"
                >
                  Reset all filters
                </button>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFiltersModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowFiltersModal(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm w-full sm:w-auto"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;