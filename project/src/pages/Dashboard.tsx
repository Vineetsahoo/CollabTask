import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CheckSquare, 
  Clock, 
  Users,  
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  TrendingUp,
  Activity,
  BellIcon,
  Filter,
  Star,
  X,
  PieChart,
  LineChart,
  BarChart,
  Download,
  Share2
} from 'lucide-react';
import ProductivityChart from '../components/ProductivityChart';

interface DashboardState {
  chartPeriod: 'week' | 'month';
  filterType: string;
  notifications: Notification[];
  lastRefresh: string;
}

interface Notification {
  id: number;
  text: string;
  isRead: boolean;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface Activity {
  id: number;
  user: string;
  action: string;
  task: string;
  time: string;
}

interface Deadline {
  id: number;
  task: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

const upcomingDeadlines: Deadline[] = [
  { id: 1, task: 'Complete Project Proposal', assignee: 'Rahul Sharma', priority: 'High', dueDate: 'Tomorrow' },
  { id: 2, task: 'Review Code Changes', assignee: 'Priya Patel', priority: 'Medium', dueDate: '2 days left' },
  { id: 3, task: 'Update Documentation', assignee: 'Amit Kumar', priority: 'Low', dueDate: 'Next week' }
];

const recentActivity: Activity[] = [
  { id: 1, user: 'Rahul Sharma', action: 'completed', task: 'Homepage redesign', time: '2 hours ago' },
  { id: 2, user: 'Priya Patel', action: 'commented on', task: 'API Integration', time: '3 hours ago' },
  { id: 3, user: 'Amit Kumar', action: 'started', task: 'User Testing', time: '5 hours ago' }
];

const stats = [
  { id: 1, name: 'Total Tasks', value: '24', icon: <CheckSquare className="h-6 w-6 text-blue-500" /> },
  { id: 2, name: 'In Progress', value: '8', icon: <Clock className="h-6 w-6 text-yellow-500" /> },
  { id: 3, name: 'Team Members', value: '12', icon: <Users className="h-6 w-6 text-green-500" /> },
  { id: 4, name: 'Due Soon', value: '5', icon: <AlertTriangle className="h-6 w-6 text-red-500" /> }
];

const Dashboard = () => {
  const [state, setState] = useState<DashboardState>(() => {
    const saved = localStorage.getItem('dashboardState');
    return saved ? JSON.parse(saved) : {
      chartPeriod: 'week',
      filterType: 'all',
      notifications: [
        { id: 1, text: 'New task assigned', isRead: false, timestamp: new Date().toISOString(), type: 'info' },
        { id: 2, text: 'Meeting in 30 minutes', isRead: false, timestamp: new Date().toISOString(), type: 'warning' },
        { id: 3, text: 'Project deadline updated', isRead: false, timestamp: new Date().toISOString(), type: 'success' },
      ],
      lastRefresh: new Date().toISOString()
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<'performance' | 'team' | 'project' | 'resources'>('performance');
  const [reportTimeframe, setReportTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboardState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && e.ctrlKey) {
        setShowNotifications(prev => !prev);
      }
      if (e.key === 'r' && e.ctrlKey) {
        handleRefreshData();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setState(prev => ({
        ...prev,
        lastRefresh: new Date().toISOString()
      }));
      toast.success('Dashboard data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNotificationClick = useCallback((notificationId: number) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    }));
    toast.success('Notification marked as read');
  }, []);

  const handleCloseNotification = useCallback((notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
    }));
    
    toast.success('Notification dismissed', {
      icon: '✓',
      duration: 2000
    });
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: []
    }));
    
    toast.success('All notifications cleared', {
      icon: '🧹',
      duration: 2000
    });
    
    setShowNotifications(false);
  }, []);

  const handleProFeatures = useCallback(async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const features = [
        'Advanced Analytics',
        'Custom Workflows',
        'Team Collaboration',
        'Priority Support'
      ];
      
      toast.success(`Pro Features Activated! ${features.join(', ')}`, {
        icon: '⭐',
        style: { background: '#3b82f6', color: 'white' },
        duration: 3000
      });
    } catch (error) {
      toast.error('Failed to activate pro features');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilterClick = useCallback(() => {
    setState(prev => ({
      ...prev,
      filterType: prev.filterType === 'all' ? 'completed' : 'all'
    }));
  }, []);

  const handleViewAll = useCallback((section: 'activities' | 'deadlines' | 'reports') => {
    const filterOptions = {
      activities: ['All', 'Completed', 'In Progress', 'Comments', 'Updates'],
      deadlines: ['Today', 'This Week', 'Next Week', 'Overdue'],
      reports: ['Daily', 'Weekly', 'Monthly', 'Custom']
    };

    const options = filterOptions[section];
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} Filters\n${options.join(' • ')}`, {
      icon: '🔍',
      duration: 3000
    });
  }, []);

  const filteredActivity = useCallback(() => {
    try {
      if (state.filterType === 'all') return recentActivity;
      return recentActivity.filter(activity => 
        activity.action.toLowerCase().includes(state.filterType.toLowerCase())
      );
    } catch (error) {
      toast.error('Error filtering activities');
      return recentActivity;
    }
  }, [state.filterType]);

  const NotificationBadge = () => (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
    >
      {state.notifications.filter(n => !n.isRead).length}
    </motion.span>
  );

  const handleNotificationBell = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      toast.success(`${state.notifications.filter(n => !n.isRead).length} unread notifications`, {
        icon: '🔔',
        duration: 2000
      });
    }
  };

  const NotificationsPanel = () => (
    <AnimatePresence>
      {showNotifications && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              {state.notifications.length > 0 && (
                <button 
                  onClick={handleClearAllNotifications}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              )}
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Close notifications"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {state.notifications.length > 0 ? (
              state.notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex justify-between items-start ${
                    notification.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div onClick={() => handleNotificationClick(notification.id)}>
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleCloseNotification(notification.id, e)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors ml-2 flex-shrink-0 mt-1"
                    title="Dismiss notification"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 px-4 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        lastRefresh: new Date().toISOString()
      }));
      
      toast.success('Dashboard refreshed\nAll data is up to date', {
        icon: '🔄'
      });
    } catch (error) {
      toast.error('Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCalendarClick = () => {
    const deadlines = upcomingDeadlines.map(d => `${d.task}: ${d.dueDate}`);
    
    toast.success(`Upcoming Deadlines\n${deadlines.join('\n')}`, {
      icon: '📅',
      duration: 4000
    });
  };

  const handleReports = () => {
    setShowReportsModal(true);
  };

  const handleStatsIconClick = (statName: string) => {
    const statDetails = {
      'Total Tasks': 'View all tasks and their status',
      'In Progress': 'Currently active tasks and assignees',
      'Team Members': 'Team roster and availability',
      'Due Soon': 'Tasks due within 48 hours'
    };
    
    toast.success(`${statName}\n${statDetails[statName as keyof typeof statDetails]}`, {
      duration: 2000,
      icon: statName === 'Due Soon' ? '⚠️' : '📊'
    });
  };

  const handleFilterIconClick = () => {
    const filters = ['All', 'Active', 'Completed', 'By Date', 'By Priority'];
    toast.success(`Activity Filters\n${filters.join(' • ')}`, {
      icon: '🔍',
      duration: 2500
    });
    handleFilterClick();
  };

  const handleDeadlineClick = (deadline: Deadline) => {
    toast.success(`Deadline Details\nTask: ${deadline.task}\nAssignee: ${deadline.assignee}\nPriority: ${deadline.priority}\nDue: ${deadline.dueDate}`, {
      icon: '📅',
      duration: 3000
    });
  };

  const handleUserAvatarClick = (activity: Activity) => {
    toast.success(`${activity.user}\nRecent Activity: ${activity.action} ${activity.task}\nTime: ${activity.time}`, {
      icon: '👤',
      duration: 2500
    });
  };

  const handlePriorityIndicatorClick = (priority: 'High' | 'Medium' | 'Low') => {
    const priorityInfo = {
      'High': 'Urgent action required',
      'Medium': 'Address soon',
      'Low': 'Can be scheduled'
    };
    
    toast.success(`${priority} Priority\n${priorityInfo[priority]}`, {
      duration: 2000,
      icon: priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : '🟢'
    });
  };

  const handleChartPeriodChange = (period: 'week' | 'month') => {
    setState(prev => ({ ...prev, chartPeriod: period }));
    toast.success(`Chart period changed to: ${period}`, {
      icon: '📊',
      duration: 2000
    });
  };

  const handleTaskClick = (task: string) => {
    toast.success(`Task Details\n"${task}"\nClick to edit task properties`, {
      icon: '✏️',
      duration: 2000
    });
  };

  const handleClockIconClick = () => {
    toast.success(`Time Tracking\nView detailed time logs and reports`, {
      icon: '⏱️',
      duration: 2000
    });
  };

  const handleIconAction = (iconType: string) => {
    switch (iconType) {
      case 'activity':
        toast.success('System Status: All services operational', {
          icon: '🟢',
          duration: 2000
        });
        break;
      case 'trending':
        toast.success('Growth Metrics\nPositive trend in last 30 days', {
          icon: '📈',
          duration: 2000
        });
        break;
      case 'chart':
        toast.success('Analytics Overview\nPerformance metrics updated', {
          icon: '📊',
          duration: 2000
        });
        break;
      default:
        toast.success(`Action: ${iconType}`, {
          duration: 2000,
          icon: 'ℹ️'
        });
        break;
    }
  };

  const handleGenerateReport = async (format: 'pdf' | 'csv' | 'excel') => {
    setIsGeneratingReport(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report generated in ${format.toUpperCase()} format`, {
        icon: format === 'pdf' ? '📄' : format === 'csv' ? '📊' : '📑',
        duration: 3000
      });
      
      setTimeout(() => setShowReportsModal(false), 1000);
    } catch (error) {
      toast.error('Error generating report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleShareReport = () => {
    toast.success('Report sharing options\nEmail • Slack • Teams • Link', {
      icon: '🔗',
      duration: 2500
    });
  };

  const ReportsModal = () => {
    const reportTypes = [
      { id: 'performance', name: 'Performance Metrics', icon: <LineChart className="h-5 w-5 text-blue-500" /> },
      { id: 'team', name: 'Team Analytics', icon: <PieChart className="h-5 w-5 text-green-500" /> },
      { id: 'project', name: 'Project Progress', icon: <BarChart className="h-5 w-5 text-purple-500" /> },
      { id: 'resources', name: 'Resource Allocation', icon: <BarChart2 className="h-5 w-5 text-orange-500" /> },
    ];
    
    const timeframes = [
      { id: 'day', name: 'Daily' },
      { id: 'week', name: 'Weekly' },
      { id: 'month', name: 'Monthly' },
      { id: 'quarter', name: 'Quarterly' },
    ];
    
    return (
      <AnimatePresence>
        {showReportsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                    Advanced Reports
                  </h2>
                  <button 
                    onClick={() => setShowReportsModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-500 mt-1">Generate detailed reports and insights</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reportTypes.map(report => (
                      <div 
                        key={report.id} 
                        onClick={() => setSelectedReport(report.id as any)}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedReport === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="mr-3">{report.icon}</div>
                        <div className="text-sm font-medium">{report.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                  <div className="flex flex-wrap gap-2">
                    {timeframes.map(time => (
                      <button 
                        key={time.id}
                        onClick={() => setReportTimeframe(time.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reportTimeframe === time.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Preview</h3>
                    <div className="text-sm text-gray-500">
                      {reportTimeframe.charAt(0).toUpperCase() + reportTimeframe.slice(1)} Report
                    </div>
                  </div>
                  <div className="h-48 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    {isGeneratingReport ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <BarChart2 className="h-8 w-8 text-blue-400" />
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <BarChart2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} • {reportTimeframe.charAt(0).toUpperCase() + reportTimeframe.slice(1)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Click generate to preview</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGeneratingReport}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        isGeneratingReport
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      {isGeneratingReport ? 'Generating...' : 'Generate PDF'}
                    </button>
                    
                    <button
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGeneratingReport}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        isGeneratingReport
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      CSV
                    </button>
                    
                    <button
                      onClick={() => handleGenerateReport('excel')}
                      disabled={isGeneratingReport}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        isGeneratingReport
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Excel
                    </button>
                  </div>
                  
                  <button
                    onClick={handleShareReport}
                    disabled={isGeneratingReport}
                    className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const enhancedStats = stats.map(stat => ({
    ...stat,
    icon: (
      <div onClick={() => handleStatsIconClick(stat.name)} className="cursor-pointer">
        {stat.icon}
      </div>
    )
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 overflow-y-auto relative">
      <NotificationsPanel />
      <ReportsModal />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Get an overview of your team's performance</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Vineet</h1>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm cursor-pointer"
            onClick={() => handleIconAction('activity')}
          >
            <Activity className="h-4 w-4 mr-1" />
            <span>All systems operational</span>
          </motion.div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
          <div className="relative">
            <button 
              className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-colors relative"
              onClick={handleNotificationBell}
              title={`${state.notifications.filter(n => !n.isRead).length} unread notifications`}
            >
              <BellIcon className={`h-5 w-5 ${showNotifications ? 'text-blue-500' : 'text-gray-600'}`} />
              <NotificationBadge />
            </button>
          </div>
          <button 
            className={`flex items-center space-x-2 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-4 py-2 rounded-xl transition-colors`}
            onClick={handleProFeatures}
            disabled={isLoading}
            title="Upgrade to Pro"
          >
            <Star className="h-4 w-4" />
            <span>{isLoading ? 'Activating...' : 'Pro Features'}</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-colors relative"
            title="Refresh dashboard"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <ArrowUpRight className={`h-5 w-5 ${isRefreshing ? 'text-blue-500' : 'text-gray-600'}`} />
            </motion.div>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {enhancedStats.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3.5 bg-gray-50 rounded-xl cursor-pointer">
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt 
                        className="text-sm font-medium text-gray-500 truncate cursor-pointer"
                        onClick={() => handleTaskClick(stat.name)}
                      >
                        {stat.name}
                      </dt>
                      <dd className="flex items-center mt-1">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <span 
                          className="ml-2 flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full cursor-pointer"
                          onClick={() => handleIconAction('trending')}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          12%
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-50 gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  Recent Activity
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">Live</span>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Latest updates from your team</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={handleFilterIconClick}
                  title={`Current filter: ${state.filterType}`}
                >
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
                <button 
                  className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => handleViewAll('activities')}
                  disabled={isLoading}
                  title="View all activities"
                >
                  {isLoading ? 'Loading...' : 'View all'} <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <ul className="divide-y divide-gray-50">
                {filteredActivity().map((activity) => (
                  <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => handleUserAvatarClick(activity)}
                      >
                        <img
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                          src={`https://images.unsplash.com/photo-${1500000000000 + activity.id}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium cursor-pointer" onClick={() => handleUserAvatarClick(activity)}>
                            {activity.user}
                          </span>{' '}
                          <span className="text-gray-500">{activity.action}</span>{' '}
                          <span 
                            className="font-medium cursor-pointer"
                            onClick={() => handleTaskClick(activity.task)}
                          >
                            "{activity.task}"
                          </span>
                        </p>
                        <p 
                          className="text-xs text-gray-500 mt-0.5 cursor-pointer"
                          onClick={() => handleClockIconClick()}
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-50 gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                <p className="mt-1 text-sm text-gray-500">Tasks requiring attention</p>
              </div>
              <button 
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors self-start sm:self-auto"
                onClick={handleCalendarClick}
                title="View calendar"
              >
                Calendar <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
            <div>
              <ul className="divide-y divide-gray-50">
                {upcomingDeadlines.map((deadline) => (
                  <li 
                    key={deadline.id} 
                    className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleDeadlineClick(deadline)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span 
                          className={`flex-shrink-0 w-2 h-2 rounded-full cursor-pointer ${
                            deadline.priority === 'High' ? 'bg-red-400' : 
                            deadline.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePriorityIndicatorClick(deadline.priority);
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{deadline.task}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Assigned to: {deadline.assignee}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          deadline.dueDate.includes('Tomorrow') ? 'bg-red-100 text-red-800' : 
                          deadline.dueDate.includes('2 days') ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {deadline.dueDate}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Productivity Analytics</h2>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-50 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                Productivity Chart
              </h3>
              <p className="mt-1 text-sm text-gray-500">Performance metrics and insights</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select 
                className="block pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                value={state.chartPeriod}
                onChange={(e) => handleChartPeriodChange(e.target.value as 'week' | 'month')}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                onClick={handleReports}
                title="View detailed reports and analytics"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Reports
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 overflow-hidden">
            <div className="w-full h-[250px] xs:h-[300px] sm:h-[380px] md:h-[450px] overflow-x-auto">
              <div className="min-w-[320px] w-full h-full">
                <ProductivityChart period={state.chartPeriod} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;