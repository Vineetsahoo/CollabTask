import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Download, 
  Clock,
  CheckSquare,
  Award
} from 'lucide-react';

interface ChartDataPoint {
  date: string;
  tasks: number;
  completed: number;
  productivity: number;
  hours: number;
}

interface ProjectData {
  name: string;
  tasks: number;
  completed: number;
  hours: number;
  color: string;
}

const ModernReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState<'tasks' | 'time' | 'productivity'>('tasks');

  // Generate mock data
  const generateChartData = (days: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        tasks: Math.floor(15 + Math.random() * 25),
        completed: Math.floor(10 + Math.random() * 20),
        productivity: Math.floor(70 + Math.random() * 30),
        hours: Math.floor(6 + Math.random() * 4)
      });
    }
    return data;
  };

  const chartData = generateChartData(parseInt(dateRange));

  const projectData: ProjectData[] = [
    { name: 'Website Redesign', tasks: 45, completed: 38, hours: 120, color: '#3B82F6' },
    { name: 'Mobile App', tasks: 32, completed: 28, hours: 95, color: '#10B981' },
    { name: 'Backend API', tasks: 28, completed: 25, hours: 80, color: '#F59E0B' },
    { name: 'Marketing', tasks: 15, completed: 12, hours: 40, color: '#EF4444' },
    { name: 'Documentation', tasks: 12, completed: 10, hours: 25, color: '#8B5CF6' }
  ];

  // Calculate summary stats
  const totalTasks = chartData.reduce((sum, day) => sum + day.tasks, 0);
  const totalCompleted = chartData.reduce((sum, day) => sum + day.completed, 0);
  const totalHours = chartData.reduce((sum, day) => sum + day.hours, 0);
  const avgProductivity = Math.round(chartData.reduce((sum, day) => sum + day.productivity, 0) / chartData.length);
  const completionRate = Math.round((totalCompleted / totalTasks) * 100);

  const handleExport = () => {
    const data = {
      summary: { totalTasks, totalCompleted, totalHours, avgProductivity, completionRate },
      chartData,
      projectData,
      dateRange: `Last ${dateRange} days`,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-y-auto bg-neutral-50">
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
                <p className="text-sm text-neutral-600">Track team performance and productivity</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Logged</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productivity</p>
                <p className="text-2xl font-bold text-gray-900">{avgProductivity}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">View:</span>
            {[
              { key: 'tasks' as const, label: 'Task Completion', icon: CheckSquare },
              { key: 'time' as const, label: 'Time Tracking', icon: Clock },
              { key: 'productivity' as const, label: 'Productivity', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedMetric === 'tasks' && 'Task Completion Trends'}
              {selectedMetric === 'time' && 'Time Tracking Overview'}
              {selectedMetric === 'productivity' && 'Productivity Metrics'}
            </h2>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === 'tasks' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : selectedMetric === 'time' ? (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.2}
                    name="Hours Logged"
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    name="Productivity %"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Performance</h2>
            <div className="space-y-4">
              {projectData.map((project) => (
                <div key={project.name} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-500">{Math.round((project.completed / project.tasks) * 100)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(project.completed / project.tasks) * 100}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{project.completed}/{project.tasks} tasks</span>
                    <span>{project.hours}h logged</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Task Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="tasks"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {projectData.map((project) => (
                <div key={project.name} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm text-gray-600 flex-1">{project.name}</span>
                  <span className="text-sm font-medium text-gray-900">{project.tasks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">High Productivity</span>
              </div>
              <p className="text-sm text-green-700">
                Team productivity increased by 15% compared to last period.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Great Completion Rate</span>
              </div>
              <p className="text-sm text-blue-700">
                {completionRate}% task completion rate is above team average.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">Time Efficiency</span>
              </div>
              <p className="text-sm text-orange-700">
                Average {Math.round(totalHours / chartData.length)} hours logged per day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernReports;
