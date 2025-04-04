import { useState } from 'react';
import { 
  Plus, 
  MoreVertical,
  MessageSquare, 
  Paperclip,
  Filter,
  Users,
  Tag,
  Search,
  Layout
} from 'lucide-react';

interface UserProfile {
  name: string;
  image: string;
}

const TaskBoard = () => {
  type TaskPriority = 'High' | 'Medium' | 'Low';
  
  interface Label {
    id: string;
    name: string;
    color: string;
  }

  interface Task {
    id: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    priority: TaskPriority;
    comments: number;
    attachments: number;
    labels: Label[];
  }

  interface Column {
    id: string;
    title: string;
    tasks: Task[];
  }

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

  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { 
          id: 't1', 
          title: 'Research competitor products', 
          description: 'Analyze top 5 competitor products and create a comparison report',
          assignee: 'Rahul Sharma',
          dueDate: '2025-06-15',
          priority: 'Medium',
          comments: 3,
          attachments: 2,
          labels: []
        },
        { 
          id: 't2', 
          title: 'Update user documentation', 
          description: 'Update the user guide with new features from the latest release',
          assignee: 'Priya Patel',
          dueDate: '2025-06-18',
          priority: 'Low',
          comments: 1,
          attachments: 0,
          labels: []
        },
        { 
          id: 't3', 
          title: 'Design new landing page', 
          description: 'Create wireframes and mockups for the new marketing landing page',
          assignee: 'Ananya Desai',
          dueDate: '2025-06-20',
          priority: 'High',
          comments: 5,
          attachments: 3,
          labels: []
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [
        { 
          id: 't4', 
          title: 'API integration', 
          description: 'Integrate payment gateway API with the checkout process',
          assignee: 'Vikram Singh',
          dueDate: '2025-06-14',
          priority: 'High',
          comments: 8,
          attachments: 1,
          labels: []
        },
        { 
          id: 't5', 
          title: 'Fix payment gateway bug', 
          description: 'Investigate and fix the payment processing error on mobile devices',
          assignee: 'Neha Gupta',
          dueDate: '2025-06-12',
          priority: 'High',
          comments: 4,
          attachments: 0,
          labels: []
        }
      ]
    },
    {
      id: 'review',
      title: 'In Review',
      tasks: [
        { 
          id: 't6', 
          title: 'Implement user feedback form', 
          description: 'Add a feedback collection form to the dashboard',
          assignee: 'Arjun Kumar',
          dueDate: '2025-06-10',
          priority: 'Medium',
          comments: 2,
          attachments: 1,
          labels: []
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { 
          id: 't7', 
          title: 'Create weekly analytics report', 
          description: 'Generate and distribute the weekly performance analytics report',
          assignee: 'Anil Reddy',
          dueDate: '2025-06-05',
          priority: 'Medium',
          comments: 0,
          attachments: 2,
          labels: []
        },
        { 
          id: 't8', 
          title: 'Update privacy policy', 
          description: 'Review and update the privacy policy to comply with new regulations',
          assignee: 'Meera Iyer',
          dueDate: '2025-06-01',
          priority: 'Low',
          comments: 3,
          attachments: 1,
          labels: []
        }
      ]
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'board' | 'list'>('board');
  const [labels, setLabels] = useState<Label[]>([
    { id: 'l1', name: 'Bug', color: '#FF4D4D' },
    { id: 'l2', name: 'Feature', color: '#4DA6FF' },
    { id: 'l3', name: 'Enhancement', color: '#4DFF88' },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddColumn = () => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      tasks: []
    };
    setColumns([...columns, newColumn]);
  };

  const handleEditColumnTitle = (columnId: string, newTitle: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      setColumns(columns.filter(col => col.id !== columnId));
    }
  };

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: 'New Task',
      description: 'Add description here',
      assignee: 'Unassigned',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      comments: 0,
      attachments: 0,
      labels: []
    };
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const handleEditTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? {
            ...col,
            tasks: col.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : col
    ));
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setColumns(columns.map(col => 
        col.id === columnId 
          ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
          : col
      ));
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColumnId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

    if (sourceColumnId === targetColumnId) return;

    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    const task = sourceColumn?.tasks.find(t => t.id === taskId);

    if (!task) return;

    setColumns(columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      if (col.id === targetColumnId) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    }));
  };

  const handleNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleCreateTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `t${Date.now()}`,
      comments: 0,
      attachments: 0,
      labels: [],
    };
    setColumns(columns.map(col => 
      col.id === 'todo' 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
    setIsNewTaskModalOpen(false);
  };

  const handleToggleLabels = () => {
    setIsLabelModalOpen(!isLabelModalOpen);
  };

  const handleCreateLabel = (name: string, color: string) => {
    const newLabel: Label = {
      id: `l${Date.now()}`,
      name,
      color,
    };
    setLabels([...labels, newLabel]);
  };

  const handleViewChange = (view: 'board' | 'list') => {
    setCurrentView(view);
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    })
  }));

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
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

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Task Board</h1>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>8 team members</span>
            <span className="mx-2">•</span>
            <span>24 active tasks</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            {showFilters && (
              <div className="absolute right-0 z-10 mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Priority</p>
                  {['All', 'High', 'Medium', 'Low'].map((priority) => (
                    <label key={priority} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={filterPriority === priority}
                        onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'All')}
                        className="text-blue-500"
                      />
                      <span className="text-sm">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={handleNewTask}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Board View Controls */}
      <div className="mb-4 sm:mb-6 flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button 
            onClick={handleToggleLabels}
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600"
          >
            <Tag className="h-4 w-4 mr-2" />
            Labels
          </button>
          <div className="relative">
            <button 
              onClick={() => handleViewChange(currentView === 'board' ? 'list' : 'board')}
              className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600"
            >
              <Layout className="h-4 w-4 mr-2" />
              {currentView === 'board' ? 'Board View' : 'List View'}
            </button>
          </div>
        </div>
      </div>

      {/* Conditional render based on view */}
      {currentView === 'board' ? (
        <div className="flex overflow-x-auto pb-4 space-x-4 sm:space-x-6 -mx-4 sm:-mx-6 px-4 sm:px-6 hide-scrollbar">
          {filteredColumns.map((column) => (
            <div 
              key={column.id} 
              className="flex-shrink-0 w-72 sm:w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-3 sm:p-4 flex justify-between items-center border-b border-gray-100">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => handleEditColumnTitle(column.id, e.target.value)}
                      className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none"
                    />
                    <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {column.tasks.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteColumn(column.id)}
                    className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 min-h-[calc(100vh-16rem)]">
                  {column.tasks.map((task) => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                      className="group bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h4 
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                          onClick={() => handleEditTask(column.id, task.id, { title: prompt('Edit task title:', task.title) || task.title })}
                        >
                          {task.title}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 sm:mb-4">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white"
                            src={userProfiles[task.assignee]?.image || 'https://via.placeholder.com/256'}
                            alt={task.assignee}
                          />
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[120px]">{task.assignee}</p>
                            <p className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400">
                          {task.comments > 0 && (
                            <div className="flex items-center text-xs">
                              <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                              <span>{task.comments}</span>
                            </div>
                          )}
                          {task.attachments > 0 && (
                            <div className="flex items-center text-xs">
                              <Paperclip className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                              <span>{task.attachments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTask(column.id, task.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleAddTask(column.id)}
                    className="w-full p-2 sm:p-3 border border-dashed border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add task
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-72 sm:w-80">
            <button 
              onClick={handleAddColumn}
              className="w-full h-12 sm:h-14 border-2 border-dashed border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add new column
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {columns.flatMap(col => col.tasks).map(task => (
                <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-xs sm:text-sm text-gray-500 line-clamp-1">{task.description}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{task.assignee}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
            {/* Add your form fields here */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0">
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg sm:mr-2">
                Cancel
              </button>
              <button 
                onClick={() => handleCreateTask({
                  title: 'New Task',
                  description: '',
                  assignee: 'Unassigned',
                  dueDate: new Date().toISOString().split('T')[0],
                  priority: 'Medium',
                  labels: [],
                  comments: 0,
                  attachments: 0
                })}
                className="mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Labels Modal */}
      {isLabelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Manage Labels</h2>
            <div className="space-y-2">
              {labels.map(label => (
                <div key={label.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: label.color }}></div>
                    <span>{label.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateLabel(formData.get('name') as string, formData.get('color') as string);
              e.currentTarget.reset();
            }} className="mt-4 flex flex-wrap gap-2 items-center">
              <input type="text" name="name" placeholder="Label name" className="flex-grow border p-2 rounded text-sm" />
              <input type="color" name="color" className="w-8 h-8" />
              <button type="submit" className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">Add Label</button>
            </form>
            <button 
              onClick={() => setIsLabelModalOpen(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-lg text-sm">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for hiding scrollbars but allowing scroll functionality */}
      <style>
        {`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        `}
      </style>
    </div>
  );
};

export default TaskBoard;