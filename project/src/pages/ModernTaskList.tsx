import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  List,
  Grid,
  Calendar,
  User,
  Clock,
  MoreHorizontal,
  CheckSquare,
  Square,
  Star,
  MessageCircle,
  Paperclip,
  Eye,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';
import { mockTasks, mockUsers, mockProjects } from '../data/mockData';
import { formatDate, getPriorityColor, getStatusColor, cn } from '../utils';
import { Task } from '../types';

type ViewMode = 'list' | 'grid';
type SortField = 'title' | 'priority' | 'dueDate' | 'status' | 'assignee';
type SortOrder = 'asc' | 'desc';

export default function ModernTaskList() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Filter and sort tasks
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesProject = selectedProject === 'all' || task.project.id === selectedProject;
    const matchesAssignee = selectedAssignee === 'all' || task.assignee?.id === selectedAssignee;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'assignee':
        aValue = a.assignee?.name || '';
        bValue = b.assignee?.name || '';
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === sortedTasks.length 
        ? [] 
        : sortedTasks.map(task => task.id)
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-neutral-900">Task List</h1>
            <p className="text-neutral-600 mt-1">
              Manage and organize all your tasks in one place
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' 
                    ? 'bg-white text-brand-600 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-white text-brand-600 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                <Grid size={18} />
              </button>
            </div>
            
            <button className="btn-primary">
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Projects</option>
            {mockProjects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>

          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Assignees</option>
            {mockUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-brand-50 border border-brand-200 rounded-lg p-4 mt-4"
          >
            <span className="text-sm text-brand-700">
              {selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary text-sm">
                <Edit3 size={14} />
                Edit
              </button>
              <button className="btn-secondary text-sm">
                <Copy size={14} />
                Duplicate
              </button>
              <button className="btn-secondary text-sm text-error-600">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Task List/Grid */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'list' ? (
          <TaskListView 
            tasks={sortedTasks}
            selectedTasks={selectedTasks}
            onTaskSelect={handleTaskSelect}
            onSelectAll={handleSelectAll}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        ) : (
          <TaskGridView 
            tasks={sortedTasks}
            selectedTasks={selectedTasks}
            onTaskSelect={handleTaskSelect}
          />
        )}
      </div>
    </div>
  );
}

interface TaskListViewProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskSelect: (taskId: string) => void;
  onSelectAll: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

function TaskListView({ 
  tasks, 
  selectedTasks, 
  onTaskSelect, 
  onSelectAll, 
  sortField, 
  sortOrder, 
  onSort 
}: TaskListViewProps) {
  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-neutral-700 hover:text-neutral-900"
    >
      <span>{children}</span>
      {sortField === field && (
        <SortAsc 
          size={14} 
          className={cn(
            'transition-transform',
            sortOrder === 'desc' && 'rotate-180'
          )} 
        />
      )}
    </button>
  );

  return (
    <div className="card overflow-hidden">
      {/* Table Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 p-4">
        <div className="grid grid-cols-12 gap-4 items-center text-sm">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedTasks.length === tasks.length && tasks.length > 0}
              onChange={onSelectAll}
              className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            />
          </div>
          <div className="col-span-4">
            <SortButton field="title">Task</SortButton>
          </div>
          <div className="col-span-1">
            <SortButton field="status">Status</SortButton>
          </div>
          <div className="col-span-1">
            <SortButton field="priority">Priority</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="assignee">Assignee</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="dueDate">Due Date</SortButton>
          </div>
          <div className="col-span-1">
            <span className="text-neutral-500">Actions</span>
          </div>
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-neutral-200">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              isSelected={selectedTasks.includes(task.id)}
              onSelect={() => onTaskSelect(task.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {tasks.length === 0 && (
        <div className="p-12 text-center">
          <CheckSquare size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No tasks found</h3>
          <p className="text-neutral-500">Try adjusting your filters or create a new task.</p>
        </div>
      )}
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function TaskRow({ task, index, isSelected, onSelect }: TaskRowProps) {
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className={cn(
        'grid grid-cols-12 gap-4 items-center p-4 hover:bg-neutral-50 transition-colors',
        isSelected && 'bg-brand-50 border-l-4 border-brand-500'
      )}
    >
      <div className="col-span-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
        />
      </div>
      
      <div className="col-span-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <h3 className="font-medium text-neutral-900 truncate">{task.title}</h3>
            <p className="text-sm text-neutral-600 truncate">{task.description}</p>
            {totalSubtasks > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-16 bg-neutral-200 rounded-full h-1">
                  <div
                    className="bg-brand-500 h-1 rounded-full"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500">
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-span-1">
        <div className={cn('badge', getStatusColor(task.status))}>
          {task.status.replace('-', ' ')}
        </div>
      </div>
      
      <div className="col-span-1">
        <div className={cn('badge', getPriorityColor(task.priority))}>
          {task.priority}
        </div>
      </div>
      
      <div className="col-span-2">
        {task.assignee ? (
          <div className="flex items-center space-x-2">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-neutral-900 truncate">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-neutral-500">Unassigned</span>
        )}
      </div>
      
      <div className="col-span-2">
        {task.dueDate ? (
          <div className="flex items-center space-x-1 text-sm text-neutral-600">
            <Calendar size={14} />
            <span>{formatDate(task.dueDate, 'short')}</span>
          </div>
        ) : (
          <span className="text-sm text-neutral-500">No due date</span>
        )}
      </div>
      
      <div className="col-span-1">
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-neutral-100 rounded">
            <Eye size={14} className="text-neutral-500" />
          </button>
          <button className="p-1 hover:bg-neutral-100 rounded">
            <Edit3 size={14} className="text-neutral-500" />
          </button>
          <button className="p-1 hover:bg-neutral-100 rounded">
            <MoreHorizontal size={14} className="text-neutral-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface TaskGridViewProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskSelect: (taskId: string) => void;
}

function TaskGridView({ tasks, selectedTasks, onTaskSelect }: TaskGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            isSelected={selectedTasks.includes(task.id)}
            onSelect={() => onTaskSelect(task.id)}
          />
        ))}
      </AnimatePresence>
      
      {tasks.length === 0 && (
        <div className="col-span-full p-12 text-center">
          <CheckSquare size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No tasks found</h3>
          <p className="text-neutral-500">Try adjusting your filters or create a new task.</p>
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function TaskCard({ task, index, isSelected, onSelect }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'card p-6 cursor-pointer transition-all',
        isSelected && 'ring-2 ring-brand-500 bg-brand-50'
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn('badge', getPriorityColor(task.priority))}>
          {task.priority}
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-medium text-neutral-900 mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-sm text-neutral-600 line-clamp-3">{task.description}</p>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-neutral-500">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span>Progress</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-neutral-500">
          {task.dueDate && (
            <div className="flex items-center space-x-1 text-xs">
              <Calendar size={12} />
              <span>{formatDate(task.dueDate, 'short')}</span>
            </div>
          )}
          
          {task.comments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs">
              <MessageCircle size={12} />
              <span>{task.comments.length}</span>
            </div>
          )}
          
          {task.attachments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs">
              <Paperclip size={12} />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Status & Assignee */}
        <div className="flex items-center space-x-2">
          <div className={cn('badge text-xs', getStatusColor(task.status))}>
            {task.status.replace('-', ' ')}
          </div>
          {task.assignee && (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover"
              title={task.assignee.name}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
