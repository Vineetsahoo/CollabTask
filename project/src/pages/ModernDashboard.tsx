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
  MoreVertical,
  Play,
  Pause,
  Square,
  Clock,
  Video,
  Users,
  Timer,
  Coffee
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export default function ModernDashboard() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentTime] = useState('04:21:58');
  const [currentTask] = useState('Working on Dashboard Design');
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: 'Finish the sales presentation 🎯 for the client meeting at 2:00 PM', completed: false },
    { id: 2, text: 'Send follow-up emails to potential leads', completed: true },
    { id: 3, text: 'Review and approve the marketing budget 💼', completed: false },
    { id: 4, text: 'Take 10 minutes for meditation or deep breathing', completed: true },
  ]);

  const recentTimeEntries = [
    { task: 'Client Presentation', time: '2h 15m', color: 'bg-blue-500' },
    { task: 'Email Follow-ups', time: '1h 30m', color: 'bg-green-500' },
    { task: 'Budget Review', time: '45m', color: 'bg-amber-500' },
  ];

  const meetingParticipants = [
    { name: 'John Doe', avatar: 'JD' },
    { name: 'Sarah Smith', avatar: 'SS' },
    { name: 'Mike Johnson', avatar: 'MJ' },
  ];

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
      icon: <CheckSquare size={20} />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Completed',
      value: mockDashboardStats.completedTasks,
      change: '+8%',
      trend: 'up',
      icon: <Target size={20} />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'In Progress',
      value: mockDashboardStats.tasksInProgress,
      change: '+3%',
      trend: 'up',
      icon: <Activity size={20} />,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Overdue',
      value: mockDashboardStats.overdueTasks,
      change: '-2%',
      trend: 'down',
      icon: <AlertTriangle size={20} />,
      color: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <div className="p-6 lg:p-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 flex items-center gap-3">
              <span className="bg-gradient-to-r from-neutral-700 to-neutral-900 bg-clip-text text-transparent">Good morning,</span>
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">Amanda</span>
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Calendar size={16} />
              <span className="font-medium">Monday, September 30, 2024</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="btn-primary text-sm">
              <Plus size={16} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg",
                  stat.color
                )}>
                  {stat.icon}
                </div>
                <div className={cn(
                  "flex items-center text-xs font-semibold px-2.5 py-1 rounded-full",
                  stat.trend === 'up' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
                )}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-600 mt-1.5">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* To-do List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="card p-6 h-full flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold text-neutral-900">📝 To-do List</h3>
                </div>
                <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-neutral-400" />
                </button>
              </div>
              
              <div className="space-y-3 mb-4 flex-1 overflow-auto">
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
                        "mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 transform",
                        item.completed
                          ? "bg-brand-500 border-brand-500 scale-110"
                          : "border-neutral-300 hover:border-brand-400 hover:scale-105"
                      )}
                    >
                      {item.completed && (
                        <motion.svg
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
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

              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-neutral-200 hover:border-brand-400 hover:bg-brand-50/50 text-neutral-500 hover:text-brand-600 transition-all font-medium text-sm mt-auto">
                <Plus size={16} />
                Create new
              </button>
            </div>
          </motion.div>

          {/* Time Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="card p-6 h-full flex flex-col min-h-[480px]">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={20} className="text-brand-600" />
                <h3 className="text-lg font-bold text-neutral-900">Time Tracker</h3>
              </div>
              
              <div className="text-center flex-1 flex flex-col justify-center">
                {/* Current Task */}
                {timerRunning && currentTask && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 px-4 py-2 bg-brand-50 rounded-lg inline-flex items-center gap-2 mx-auto"
                  >
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-brand-700">{currentTask}</span>
                  </motion.div>
                )}

                <div className={cn(
                  "text-6xl font-bold text-neutral-900 tracking-tight mb-8 tabular-nums transition-all duration-300",
                  timerRunning && "animate-pulse"
                )}>
                  {currentTime}
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl",
                      timerRunning 
                        ? "bg-neutral-900 hover:bg-neutral-800 text-white" 
                        : "bg-brand-500 hover:bg-brand-600 text-white"
                    )}
                  >
                    {timerRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                  <button className="w-16 h-16 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg hover:shadow-xl text-white">
                    <Square size={28} fill="currentColor" />
                  </button>
                </div>
              </div>
              
              {/* Break Reminder */}
              {timerRunning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2"
                >
                  <Coffee size={16} className="text-amber-600" />
                  <span className="text-xs text-amber-700">Take a break in 15 minutes</span>
                </motion.div>
              )}

              {/* Today's Total */}
              <div className="w-full pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-neutral-600">Today's total</span>
                  <span className="font-bold text-neutral-900">8h 42m</span>
                </div>

                {/* Recent Time Entries */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer size={14} className="text-neutral-500" />
                    <span className="text-xs font-semibold text-neutral-700">Recent Entries</span>
                  </div>
                  {recentTimeEntries.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", entry.color)} />
                        <span className="text-xs text-neutral-700">{entry.task}</span>
                      </div>
                      <span className="text-xs font-semibold text-neutral-900">{entry.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="card p-6 h-full min-h-[420px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900">Weekly Activity</h3>
                <div className="flex gap-1">
                  <button className="px-3 py-1.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-lg">This Week</button>
                </div>
              </div>
              
              {/* Activity Rings */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-52 h-52">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    {/* Working hours ring */}
                    <circle
                      cx="104"
                      cy="104"
                      r="75"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="104"
                      cy="104"
                      r="75"
                      stroke="url(#gradient1)"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 75}`}
                      strokeDashoffset={`${2 * Math.PI * 75 * (1 - 29/40)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    
                    {/* Tasks completed ring */}
                    <circle
                      cx="104"
                      cy="104"
                      r="55"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="104"
                      cy="104"
                      r="55"
                      stroke="url(#gradient2)"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 55}`}
                      strokeDashoffset={`${2 * Math.PI * 55 * (1 - 8/12)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    
                    {/* Projects completed ring */}
                    <circle
                      cx="104"
                      cy="104"
                      r="35"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="104"
                      cy="104"
                      r="35"
                      stroke="url(#gradient3)"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - 4/7)}`}
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
              <div className="space-y-3 mt-auto">
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

          {/* Reminder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 min-h-[420px] flex flex-col justify-center">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Calendar size={28} className="text-brand-600" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-bold text-neutral-900">Today's Meeting</p>
                    {/* Countdown Timer */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="px-2.5 py-1 bg-brand-100 rounded-lg"
                    >
                      <span className="text-xs font-bold text-brand-700">Starting in 2h 15m</span>
                    </motion.div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">9:00 AM - 10:30 AM</p>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-4">Team standup and project review session</p>
                  
                  {/* Participants */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-neutral-500" />
                      <span className="text-xs text-neutral-600">Participants:</span>
                    </div>
                    <div className="flex -space-x-2">
                      {meetingParticipants.map((participant, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-white flex items-center justify-center shadow-sm"
                          title={participant.name}
                        >
                          <span className="text-[10px] font-bold text-white">{participant.avatar}</span>
                        </motion.div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-semibold text-neutral-600">+2</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                      <Video size={16} />
                      Join Meeting
                    </button>
                    <button className="px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium text-sm transition-colors border border-neutral-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Productivity Chart - Full width on bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-12"
          >
            <div className="card p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Team Productivity</h3>
                  <p className="text-sm text-neutral-500 mt-1">Weekly performance overview</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
                    <span className="text-neutral-600">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <span className="text-neutral-600">Hours</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
