import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProductivityChartProps {
  period: 'week' | 'month';
}

const ProductivityChart = ({ period }: ProductivityChartProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [period]);

  const weekData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 17, 22, 8, 10],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Hours Worked',
        data: [8, 7.5, 8, 6.5, 7, 4, 3],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const monthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [45, 52, 38, 41],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Hours Worked',
        data: [32, 35, 28, 30],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const currentData = period === 'week' ? weekData : monthData;
  const prevPeriodData = period === 'week' 
    ? [40, 48, 35, 39] 
    : [7, 6.5, 7.5, 6, 8, 5, 4];

  const totalTasks = currentData.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalHours = currentData.datasets[1].data.reduce((a, b) => a + b, 0);
  const prevTasks = prevPeriodData.reduce((a, b) => a + b, 0);
  
  const taskChange = ((totalTasks - prevTasks) / prevTasks) * 100;

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 10  // Add padding at the bottom
      }
    },
    animation: {
      duration: animate ? 1000 : 0,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          },
          boxWidth: 6
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          padding: 10,
          font: {
            size: 11
          },
          maxRotation: 0,  // Prevent label rotation
          autoSkip: true,  // Skip labels if they overlap
          autoSkipPadding: 15  // Minimum spacing between labels
        },
        border: {
          display: true,  // Show X axis line
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        backgroundColor: '#fff'
      }
    }
  };    

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-900">Total Tasks</h4>
            <span className={`flex items-center text-sm ${taskChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {taskChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(taskChange).toFixed(1)}%
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-blue-900">{totalTasks}</p>
          <div className="mt-1 flex items-center text-xs text-blue-700">
            vs {prevTasks} last {period} <ArrowRight className="h-3 w-3 ml-1" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-green-900">Hours Worked</h4>
            <span className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              5.2%
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-green-900">{totalHours}</p>
          <div className="mt-1 flex items-center text-xs text-green-700">
            Avg {(totalHours / currentData.labels.length).toFixed(1)} hrs/day
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-900">Productivity Score</h4>
            <span className="flex items-center text-sm text-purple-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              8.3%
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-purple-900">
            {((totalTasks / totalHours) * 10).toFixed(1)}
          </p>
          <div className="mt-1 flex items-center text-xs text-purple-700">
            Tasks per hour
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="h-[350px] pb-4"> {/* Added padding bottom */}
          <Line data={currentData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
