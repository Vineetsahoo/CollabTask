import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Plus,
  Activity,
  Target,
  ChevronRight,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockDashboardStats } from '../data/mockData';
import { cn } from '../utils';

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
  { name: 'In Progress', value: 30, color: '#f59e0b' },
  { name: 'To Do', value: 15, color: '#3b82f6' },
  { name: 'Overdue', value: 10, color: '#ef4444' },
];

export default function ModernDashboard() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentTime] = useState('04:21:58');
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: 'Finish the sales presentation 🎯 for the client meeting at 2:00 PM', completed: false },
    { id: 2, text: 'Send follow-up emails to potential leads', completed: true },
    { id: 3, text: 'Review and approve the marketing budget 💼', completed: false },
    { id: 4, text: 'Take 10 minutes for meditation or deep breathing', completed: true },
  ]);

  const toggleTodo = (id: number) => {
    setTodoItems(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

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
    <div className="h-full overflow-y-auto bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 flex items-center gap-3">
            <span className="bg-gradient-to-r from-neutral-700 to-neutral-900 bg-clip-text text-transparent">Good morning,</span>
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">Amanda</span>
          </h1>
          <p className="text-neutral-500 mt-2 flex items-center gap-2">
            <Calendar size={16} />
            <span className="font-medium">Monday, September 30</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="btn-secondary text-sm">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="btn-primary text-sm">
            <Plus size={16} />
            <span className="hidden sm:inline">Create</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - To do list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-neutral-900">📝 To do list</h3>
              </div>
              <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-neutral-400" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {todoItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                >
                  <button
                    onClick={() => toggleTodo(item.id)}
                    className={cn(
                      "mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      item.completed
                        ? "bg-brand-500 border-brand-500"
                        : "border-neutral-300 hover:border-brand-400"
                    )}
                  >
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={cn(
                    "text-sm flex-1 leading-relaxed transition-all",
                    item.completed 
                      ? "text-neutral-400 line-through" 
                      : "text-neutral-700"
                  )}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-neutral-200 hover:border-brand-400 hover:bg-brand-50/50 text-neutral-500 hover:text-brand-600 transition-all font-medium text-sm">
              <Plus size={16} />
              Create new
            </button>
          </div>

          {/* Reminder Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Reminder</h3>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                  <ChevronRight size={16} className="text-neutral-400 rotate-180" />
                </button>
                <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                  <ChevronRight size={16} className="text-neutral-400" />
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar size={20} className="text-brand-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">Today's Meeting</p>
                  <p className="text-xs text-neutral-500">9:00 AM - 10:30 AM</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600">Team standup and project review session</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Middle Column - Time tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Time tracker</h3>
              <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-neutral-400" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-neutral-900 tracking-tight mb-8">
                {currentTime}
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-8">
                <button 
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                    timerRunning 
                      ? "bg-neutral-900 hover:bg-neutral-800 text-white" 
                      : "bg-neutral-900 hover:bg-neutral-800 text-white"
                  )}
                >
                  {timerRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
                </button>
                <button className="w-14 h-14 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg text-white">
                  <Square size={24} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* Tasks assigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 mt-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Tasks I've assigned</h3>
              <button className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4 border-b border-neutral-100 pb-3">
              <button className="text-sm font-semibold text-brand-600 pb-1 border-b-2 border-brand-600">Upcoming</button>
              <button className="text-sm font-medium text-neutral-500 hover:text-neutral-700">Overdue</button>
              <button className="text-sm font-medium text-neutral-500 hover:text-neutral-700">Completed</button>
            </div>

            <div className="space-y-4">
              {[
                { title: 'New ideas for campaign', color: 'bg-red-500', progress: 60, avatars: 2 },
                { title: 'Change button', color: 'bg-amber-500', progress: 27, avatars: 1 },
                { title: 'New BrandBook', color: 'bg-amber-100', progress: 95, avatars: 2 },
              ].map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", task.color)}></div>
                      <span className="text-sm font-medium text-neutral-700">{task.title}</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">{task.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex -space-x-2">
                      {[...Array(task.avatars)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-neutral-300 border-2 border-white"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Activity</h3>
              <div className="flex gap-1">
                <button className="px-3 py-1 text-xs font-semibold bg-brand-100 text-brand-700 rounded-lg">weekly</button>
                <button className="px-3 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 rounded-lg">daily</button>
              </div>
            </div>
            
            {/* Activity Rings */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                {/* Background rings */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  {/* Working hours ring */}
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    stroke="url(#gradient1)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - 29/40)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  
                  {/* Tasks completed ring */}
                  <circle
                    cx="96"
                    cy="96"
                    r="52"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="52"
                    stroke="url(#gradient2)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - 8/12)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  
                  {/* Projects completed ring */}
                  <circle
                    cx="96"
                    cy="96"
                    r="34"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="34"
                    stroke="url(#gradient3)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - 4/7)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-neutral-900">29<span className="text-neutral-400 text-2xl">/40</span></div>
                  <div className="text-xs text-neutral-500 mt-1">Working hours</div>
                </div>
              </div>
            </div>

            {/* Activity legend */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <span className="text-sm text-neutral-600">Working hours</span>
                </div>
                <span className="text-sm font-bold text-neutral-900">29/40</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
                  <span className="text-sm text-neutral-600">Tasks completed</span>
                </div>
                <span className="text-sm font-bold text-neutral-900">8/12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <span className="text-sm text-neutral-600">Projects completed</span>
                </div>
                <span className="text-sm font-bold text-neutral-900">4/7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Bottom Row - Team Productivity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Team Productivity</h3>
            <p className="text-sm text-neutral-500">Weekly performance overview</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"></div>
              <span className="text-neutral-600">Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-success-500 to-emerald-500 rounded-full"></div>
              <span className="text-neutral-600">Hours</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={13} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={13}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)'
              }}
              labelStyle={{ color: '#1f2937', fontWeight: 600 }}
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 0, r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="hours" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 0, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      </div>
    </div>
  );
}
