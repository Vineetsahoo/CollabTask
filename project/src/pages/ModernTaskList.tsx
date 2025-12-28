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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-1">Task List</h1>
            <p className="text-neutral-500">
              Manage and organize all your tasks in one place
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-50 rounded-lg p-1 border border-neutral-200">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-neutral-400 hover:text-neutral-600'
                )}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-neutral-400 hover:text-neutral-600'
                )}
              >
                <Grid size={18} />
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors shadow-sm">
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-neutral-700 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
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
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-neutral-700 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
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
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-neutral-700 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="all">All Projects</option>
              {mockProjects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>

            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-neutral-700 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="all">All Assignees</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List/Grid */}
      <div className="flex-1 overflow-auto px-8 py-6 bg-neutral-50">
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
      className="flex items-center gap-1 text-left font-medium text-neutral-600 hover:text-neutral-900 text-sm"
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
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="bg-white border-b border-neutral-100 px-6 py-4">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={selectedTasks.length === tasks.length && tasks.length > 0}
              onChange={onSelectAll}
              className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-3">
            <SortButton field="title">Task</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="status">Status</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="priority">Priority</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="assignee">Assignee</SortButton>
          </div>
          <div className="col-span-1">
            <SortButton field="dueDate">Due Date</SortButton>
          </div>
          <div className="col-span-1 text-right">
            <span className="text-sm font-medium text-neutral-600">Actions</span>
          </div>
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-neutral-100">
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
        <div className="p-16 text-center">
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
  const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className={cn(
        'grid grid-cols-12 gap-6 items-center px-6 py-4 hover:bg-neutral-50 transition-colors',
        isSelected && 'bg-blue-50'
      )}
    >
      <div className="col-span-1 flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
      
      <div className="col-span-3">
        <h3 className="font-semibold text-neutral-900 mb-1">{task.title}</h3>
        <p className="text-sm text-neutral-500 mb-2">{task.description}</p>
        {totalSubtasks > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 max-w-[120px] bg-neutral-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        )}
      </div>
      
      <div className="col-span-2">
        <span className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
          task.status === 'completed' && 'bg-green-100 text-green-700',
          task.status === 'in-progress' && 'bg-blue-100 text-blue-700',
          task.status === 'review' && 'bg-purple-100 text-purple-700',
          task.status === 'todo' && 'bg-neutral-100 text-neutral-700'
        )}>
          {task.status === 'in-progress' ? 'in progress' : task.status}
        </span>
      </div>
      
      <div className="col-span-2">
        <span className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
          task.priority === 'urgent' && 'bg-red-100 text-red-700',
          task.priority === 'high' && 'bg-orange-100 text-orange-700',
          task.priority === 'medium' && 'bg-amber-100 text-amber-700',
          task.priority === 'low' && 'bg-neutral-100 text-neutral-600'
        )}>
          {task.priority}
        </span>
      </div>
      
      <div className="col-span-2">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-neutral-700 font-medium truncate">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-neutral-400">Unassigned</span>
        )}
      </div>
      
      <div className="col-span-1">
        {task.dueDate ? (
          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
            <Calendar size={16} className="text-neutral-400" />
            <span>{formatDate(task.dueDate, 'short')}</span>
          </div>
        ) : (
          <span className="text-sm text-neutral-400">-</span>
        )}
      </div>
      
      <div className="col-span-1 flex items-center justify-end gap-1">
        <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors" title="View">
          <Eye size={16} className="text-neutral-400" />
        </button>
        <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors" title="Edit">
          <Edit3 size={16} className="text-neutral-400" />
        </button>
        <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors" title="More">
          <MoreHorizontal size={16} className="text-neutral-400" />
        </button>
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
