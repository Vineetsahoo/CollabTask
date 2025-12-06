import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  Plus,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  Star,
  MessageSquare,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockDashboardStats, mockTasks, mockUsers, mockActivityItems } from '../data/mockData';
import { formatDate, getPriorityColor, getStatusColor, cn } from '../utils';

// Sample data for charts
const productivityData = [
  { name: 'Mon', tasks: 12, hours: 8.5 },
  { name: 'Tue', tasks: 15, hours: 9.2 },
  { name: 'Wed', tasks: 8, hours: 7.1 },
  { name: 'Thu', tasks: 18, hours: 10.3 },
  { name: 'Fri', tasks: 14, hours: 8.8 },
  { name: 'Sat', tasks: 6, hours: 4.2 },
  { name: 'Sun', tasks: 3, hours: 2.1 },
];

const taskDistribution = [
  { name: 'Completed', value: 45, color: '#22c55e' },
  { name: 'In Progress', value: 30, color: '#3b82f6' },
  { name: 'Todo', value: 20, color: '#6b7280' },
  { name: 'Overdue', value: 5, color: '#ef4444' },
];

const projectProgress = [
  { name: 'Website Redesign', progress: 75, color: '#3b82f6' },
  { name: 'Mobile App', progress: 45, color: '#10b981' },
  { name: 'Marketing Campaign', progress: 90, color: '#f59e0b' },
  { name: 'API Documentation', progress: 60, color: '#8b5cf6' },
];

export default function ModernDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    {
      title: 'Total Tasks',
      value: mockDashboardStats.totalTasks,
      change: '+12%',
      trend: 'up',
      icon: <CheckSquare size={24} />,
      color: 'bg-brand-500',
    },
    {
      title: 'Completed',
      value: mockDashboardStats.completedTasks,
      change: '+8%',
      trend: 'up',
      icon: <Target size={24} />,
      color: 'bg-success-500',
    },
    {
      title: 'In Progress',
      value: mockDashboardStats.tasksInProgress,
      change: '+3%',
      trend: 'up',
      icon: <Activity size={24} />,
      color: 'bg-warning-500',
    },
    {
      title: 'Overdue',
      value: mockDashboardStats.overdueTasks,
      change: '-2%',
      trend: 'down',
      icon: <AlertTriangle size={24} />,
      color: 'bg-error-500',
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-neutral-50">
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Good morning, Alex! 👋
          </h1>
          <p className="text-neutral-600 mt-1">
            Here's what's happening with your team today.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn-secondary">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="btn-secondary">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                stat.color
              )}>
                {stat.icon}
              </div>
              <div className={cn(
                "flex items-center text-sm font-medium",
                stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
              )}>
                {stat.change}
                <TrendingUp size={14} className="ml-1" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-600">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Team Productivity</h3>
              <p className="text-sm text-neutral-600">Tasks completed vs. hours worked</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-brand-500 rounded-full mr-2"></div>
                <span className="text-neutral-600">Tasks</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                <span className="text-neutral-600">Hours</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Task Distribution</h3>
              <p className="text-sm text-neutral-600">Current status breakdown</p>
            </div>
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {taskDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-neutral-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
              <p className="text-sm text-neutral-600">Latest updates from your team</p>
            </div>
            <button className="text-brand-600 hover:text-brand-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {mockActivityItems.slice(0, 5).map((activity, index) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-neutral-900">
                    <span className="font-medium">{activity.user.name}</span>{' '}
                    {activity.message}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDate(activity.timestamp, 'relative')}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-400" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions & Upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary justify-start">
                <Plus size={16} />
                Create Task
              </button>
              <button className="w-full btn-secondary justify-start">
                <Users size={16} />
                Invite Member
              </button>
              <button className="w-full btn-secondary justify-start">
                <MessageSquare size={16} />
                Start Chat
              </button>
              <button className="w-full btn-secondary justify-start">
                <Calendar size={16} />
                Schedule Meeting
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {mockDashboardStats.upcomingDeadlines.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">{task.title}</p>
                    <p className="text-xs text-neutral-500">{formatDate(task.dueDate!, 'short')}</p>
                  </div>
                  <div className={cn('badge', getPriorityColor(task.priority))}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
