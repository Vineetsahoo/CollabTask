import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, ChevronRight, Calendar, Download, Filter } from 'lucide-react';

// Add type definition for chart data
interface ChartDataPoint {
  date: string;
  sales: number;
  users: number;
  transactions: number;
}

// Add these new interfaces near the top with other interfaces
interface DetailedMetrics {
  monthOverMonth: {
    revenue: number;
    users: number;
    transactions: number;
    conversionRate: number;
  };
  yearOverYear: {
    revenue: number;
    users: number;
    transactions: number;
    conversionRate: number;
  };
  topPerformingDays: Array<{
    date: string;
    revenue: number;
    percentageIncrease: number;
  }>;
  segmentGrowth: Array<{
    segment: string;
    growth: number;
    users: number;
  }>;
}

// Update the generateDailyData function with proper typing
const generateDailyData = (days: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(2000 + Math.random() * 4000),
      users: Math.floor(1000 + Math.random() * 2000),
      transactions: Math.floor(100 + Math.random() * 200)
    });
  }
  return data;
};

const Reports: React.FC = () => {
  // Update state management
  const [dateRange, setDateRange] = useState('30');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [chartData, setChartData] = useState(generateDailyData(30));
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  // Add handler functions
  const handleExport = () => {
    const data = {
      salesData: chartData,
      timestamp: new Date().toISOString(),
      dateRange: `Last ${dateRange} days`
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Enhanced date range handling
  const handleDateRangeChange = (days: string) => {
    setDateRange(days);
    setChartData(generateDailyData(parseInt(days)));
    setShowDateFilter(false);
  };

  // Add data aggregation functions
  const aggregateData = (data: any[], view: 'daily' | 'weekly' | 'monthly') => {
    if (view === 'daily') return data;

    const aggregated = data.reduce((acc: any, item: any) => {
      const date = new Date(item.date);
      const key = view === 'weekly' 
        ? `Week ${Math.ceil(date.getDate() / 7)}-${date.getMonth() + 1}` 
        : `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (!acc[key]) {
        acc[key] = { 
          date: key, 
          sales: 0, 
          users: 0, 
          transactions: 0,
          count: 0 
        };
      }
      
      acc[key].sales += item.sales;
      acc[key].users += item.users;
      acc[key].transactions += item.transactions;
      acc[key].count += 1;
      
      return acc;
    }, {});

    return Object.values(aggregated).map((item: any) => ({
      date: item.date,
      sales: Math.round(item.sales / item.count),
      users: Math.round(item.users / item.count),
      transactions: Math.round(item.transactions / item.count)
    }));
  };

  // Get processed data for charts
  const getChartData = () => {
    return aggregateData(chartData, chartView);
  };

  // Update statistics calculation with proper typing
  const getStatistics = () => {
    const currentData = chartData;
    const previousPeriodData = generateDailyData(parseInt(dateRange));

    const getCurrentTotal = (key: keyof Omit<ChartDataPoint, 'date'>) => 
      currentData.reduce((sum, item) => sum + item[key], 0);
    
    const getPreviousTotal = (key: keyof Omit<ChartDataPoint, 'date'>) =>
      previousPeriodData.reduce((sum, item) => sum + item[key], 0);

    const calculateGrowth = (current: number, previous: number) =>
      previous ? ((current - previous) / previous) * 100 : 0;

    const stats = {
      revenue: {
        current: getCurrentTotal('sales'),
        previous: getPreviousTotal('sales')
      },
      users: {
        current: getCurrentTotal('users'),
        previous: getPreviousTotal('users')
      },
      transactions: {
        current: getCurrentTotal('transactions'),
        previous: getPreviousTotal('transactions')
      }
    };

    return {
      totalSales: stats.revenue.current,
      salesGrowth: calculateGrowth(stats.revenue.current, stats.revenue.previous),
      totalUsers: stats.users.current,
      userGrowth: calculateGrowth(stats.users.current, stats.users.previous),
      totalTransactions: stats.transactions.current,
      transactionGrowth: calculateGrowth(
        stats.transactions.current,
        stats.transactions.previous
      )
    };
  };

  // Add chart configuration
  const chartConfig = {
    revenue: {
      title: 'Revenue Overview',
      subtitle: 'Daily revenue statistics',
      dataKey: 'sales',
      color: '#6366F1',
      prefix: '$'
    },
    users: {
      title: 'User Activity',
      subtitle: 'Active users over time',
      dataKey: 'users',
      color: '#818CF8',
      prefix: ''
    }
  };

  // Add this new function to calculate detailed metrics
  const getDetailedMetrics = (): DetailedMetrics => {
    const currentData = chartData;
    const previousMonthData = generateDailyData(30);
    const previousYearData = generateDailyData(365);

    const calculateGrowth = (current: number, previous: number) =>
      previous ? ((current - previous) / previous) * 100 : 0;

    const getAverageMetrics = (data: ChartDataPoint[]) => ({
      revenue: data.reduce((sum, item) => sum + item.sales, 0) / data.length,
      users: data.reduce((sum, item) => sum + item.users, 0) / data.length,
      transactions: data.reduce((sum, item) => sum + item.transactions, 0) / data.length,
      conversionRate: (data.reduce((sum, item) => sum + item.transactions, 0) / 
                      data.reduce((sum, item) => sum + item.users, 0)) * 100
    });

    const currentMetrics = getAverageMetrics(currentData);
    const previousMonthMetrics = getAverageMetrics(previousMonthData);
    const previousYearMetrics = getAverageMetrics(previousYearData);

    return {
      monthOverMonth: {
        revenue: calculateGrowth(currentMetrics.revenue, previousMonthMetrics.revenue),
        users: calculateGrowth(currentMetrics.users, previousMonthMetrics.users),
        transactions: calculateGrowth(currentMetrics.transactions, previousMonthMetrics.transactions),
        conversionRate: calculateGrowth(currentMetrics.conversionRate, previousMonthMetrics.conversionRate)
      },
      yearOverYear: {
        revenue: calculateGrowth(currentMetrics.revenue, previousYearMetrics.revenue),
        users: calculateGrowth(currentMetrics.users, previousYearMetrics.users),
        transactions: calculateGrowth(currentMetrics.transactions, previousYearMetrics.transactions),
        conversionRate: calculateGrowth(currentMetrics.conversionRate, previousYearMetrics.conversionRate)
      },
      topPerformingDays: currentData
        .map(day => ({
          date: day.date,
          revenue: day.sales,
          percentageIncrease: calculateGrowth(day.sales, previousMonthMetrics.revenue)
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      segmentGrowth: [
        {
          segment: 'Mobile Users',
          growth: 23.5,
          users: 1234
        },
        {
          segment: 'Desktop Users',
          growth: 15.2,
          users: 3456
        },
        {
          segment: 'New Customers',
          growth: 45.8,
          users: 890
        },
        {
          segment: 'Returning Customers',
          growth: 12.3,
          users: 2345
        }
      ]
    };
  };

  // Update the DetailedReport component
  const DetailedReport = () => {
    const metrics = getDetailedMetrics();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Detailed Growth Report</h2>
            <button 
              onClick={() => setShowDetailedReport(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Period Comparisons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-gray-900">Month-over-Month Growth</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(metrics.monthOverMonth).map(([key, value]) => (
                    <div key={key} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className={`text-xl sm:text-2xl font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {value >= 0 ? '+' : ''}{value.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-gray-900">Year-over-Year Growth</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(metrics.yearOverYear).map(([key, value]) => (
                    <div key={key} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className={`text-xl sm:text-2xl font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {value >= 0 ? '+' : ''}{value.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performing Days */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-gray-900">Top Performing Days</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="space-y-4">
                  {metrics.topPerformingDays.map((day, index) => (
                    <div key={day.date} className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}</p>
                          <p className="text-sm text-gray-600">Revenue: ${day.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-medium mt-2 sm:mt-0">+{day.percentageIncrease.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Segment Performance */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-gray-900">Segment Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {metrics.segmentGrowth.map(segment => (
                  <div key={segment.segment} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{segment.segment}</p>
                      <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                        segment.growth >= 20 ? 'bg-green-100 text-green-800' : 
                        segment.growth >= 10 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        +{segment.growth}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{segment.users.toLocaleString()} users</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDetailedReport(false)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Track your business performance and growth</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Last {dateRange} Days
            </button>
            {showDateFilter && (
              <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                {['7', '14', '30', '90'].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleDateRangeChange(days)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Last {days} days
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-xl">
              <DollarSign className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
            </div>
            <span className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full">
              <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
              {getStatistics().salesGrowth.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">${getStatistics().totalSales.toLocaleString()}</p>
          <div className="mt-3 flex items-center text-xs sm:text-sm text-gray-600">
            <span className="text-green-600 font-medium">↑ $3,240</span>
            <span className="mx-1.5">vs</span>
            <span>last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-purple-50 rounded-xl">
              <Users className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600" />
            </div>
            <span className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full">
              <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
              8.2%
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">2,445</p>
          <div className="mt-3 flex items-center text-xs sm:text-sm text-gray-600">
            <span className="text-green-600 font-medium">↑ 186</span>
            <span className="mx-1.5">vs</span>
            <span>last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-green-50 rounded-xl">
              <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
            </div>
            <button 
              onClick={() => setShowDetailedReport(true)}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
            >
              View Report <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 inline ml-1" />
            </button>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-500">Growth Rate</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">+12.5%</p>
          <div className="mt-3">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{chartConfig.revenue.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{chartConfig.revenue.subtitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={chartView}
                onChange={(e) => setChartView(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 py-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button 
                className="p-1 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (chartView === 'daily') {
                      return new Date(value).toLocaleDateString('default', { day: 'numeric', month: 'short' });
                    }
                    return value;
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#6366F1" 
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{chartConfig.users.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{chartConfig.users.subtitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={chartView}
                onChange={(e) => setChartView(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 py-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button 
                className="p-1 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (chartView === 'daily') {
                      return new Date(value).toLocaleDateString('default', { day: 'numeric', month: 'short' });
                    }
                    return value;
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="users" 
                  fill="#818CF8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Detailed Report Modal */}
      {showDetailedReport && <DetailedReport />}
    </div>
  );
};

export default Reports;
