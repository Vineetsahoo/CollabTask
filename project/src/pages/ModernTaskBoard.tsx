import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  MessageCircle,
  Paperclip,
  Search,
  AlertCircle
} from 'lucide-react';
import { mockTasks, mockUsers } from '../data/mockData';
import { formatDate, getPriorityColor, cn } from '../utils';
import { Task, KanbanColumn } from '../types';

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', status: 'todo', tasks: [], color: '#6b7280', limit: 5 },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', tasks: [], color: '#3b82f6', limit: 3 },
  { id: 'review', title: 'Review', status: 'review', tasks: [], color: '#f59e0b', limit: 4 },
  { id: 'completed', title: 'Completed', status: 'completed', tasks: [], color: '#22c55e' },
];

export default function ModernTaskBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  
  // Distribute tasks into columns
  const tasksInColumns = columns.map(column => ({
    ...column,
    tasks: mockTasks.filter(task => task.status === column.status)
  }));

  const filteredColumns = tasksInColumns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      const matchesAssignee = selectedAssignee === 'all' || task.assignee?.id === selectedAssignee;
      
      return matchesSearch && matchesPriority && matchesAssignee;
    })
  }));

  const handleTaskMove = (taskId: string, targetColumnId: string) => {
    // In a real app, this would update the task status
    console.log(`Moving task ${taskId} to ${targetColumnId}`);
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-neutral-900">Kanban Board</h1>
            <p className="text-neutral-600 mt-1">Manage tasks with drag-and-drop workflow</p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-w-[200px]"
              />
            </div>
            
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
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Assignees</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            
            <button className="btn-primary">
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden\">
        <div className="p-6">
        <div className="flex space-x-6 pb-6 min-w-max">
          {filteredColumns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="w-80 bg-neutral-100 rounded-xl p-4"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-semibold text-neutral-900">{column.title}</h3>
                  <span className="bg-neutral-200 text-neutral-600 text-xs px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                  {column.limit && column.tasks.length >= column.limit && (
                    <AlertCircle size={16} className="text-warning-500" />
                  )}
                </div>
                <button className="p-1 hover:bg-neutral-200 rounded">
                  <MoreHorizontal size={16} className="text-neutral-500" />
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                <AnimatePresence>
                  {column.tasks.map((task, taskIndex) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      index={taskIndex}
                      onMove={handleTaskMove}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Add Task Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add a task</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  index: number;
  onMove: (taskId: string, targetColumnId: string) => void;
}

function TaskCard({ task, index }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 cursor-pointer hover:shadow-md transition-all"
    >
      {/* Priority & Tags */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn('badge', getPriorityColor(task.priority))}>
          {task.priority}
        </div>
        <button className="p-1 hover:bg-neutral-100 rounded">
          <MoreHorizontal size={14} className="text-neutral-400" />
        </button>
      </div>

      {/* Task Title */}
      <h4 className="font-medium text-neutral-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-neutral-500">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
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

        {/* Assignee */}
        {task.assignee && (
          <div className="relative">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
              title={task.assignee.name}
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 border border-white rounded-full",
              task.assignee.status === 'online' ? 'bg-success-500' :
              task.assignee.status === 'away' ? 'bg-warning-500' : 'bg-neutral-400'
            )} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
