'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AreaChart, Area,
  ResponsiveContainer,
  XAxis, YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

interface CategoryData {
  name: string;
  items: number;
  value: number;
  [key: string]: string | number; // Index signature for recharts
}

interface MonthlyData {
  receiving: number[];
  shipping: number[];
  months: string[];
}

interface DashboardData {
  userName: string;
  totalItems: number;
  inventoryValue: number;
  lowStockAlerts: number;
  todaysActivity: number;
  inventoryGrowth: string;
  monthlyData: MonthlyData;
  categoryData: CategoryData[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userName: '',
    totalItems: 0,
    inventoryValue: 0,
    lowStockAlerts: 0,
    todaysActivity: 0,
    inventoryGrowth: '',
    monthlyData: {
      receiving: [],
      shipping: [],
      months: []
    },
    categoryData: []
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // Simulate loading for demo purposes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData: DashboardData = {
          userName: "Admin",
          totalItems: 888,
          inventoryValue: 27751.12,
          lowStockAlerts: 2,
          todaysActivity: 0,
          inventoryGrowth: "+12%",
          monthlyData: {
            receiving: [450, 510, 460, 590, 620, 680],
            shipping: [380, 420, 450, 510, 580, 620],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
          },
          categoryData: [
            { name: 'Electronics', items: 478, value: 9295.22 },
            { name: 'Tools', items: 92, value: 3109.08 },
            { name: 'Furniture', items: 43, value: 12349.57 },
            { name: 'Stationery', items: 275, value: 2997.25 }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600 mt-1">Key metrics</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">


          {/* Inventory Value */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {formatCurrency(dashboardData.inventoryValue)}
                </h2>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Items need reordering</p>
              <h2 className="text-3xl font-semibold text-gray-900">{dashboardData.lowStockAlerts}</h2>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-800 mb-1">Transactions processed</p>
              <h2 className="text-3xl font-semibold text-gray-600">{0}</h2>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Activity</h3>
            <p className="text-sm text-gray-600 mb-4">Receiving vs Shipping trends</p>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Jan', receiving: 450, shipping: 380 },
                    { month: 'Feb', receiving: 510, shipping: 420 },
                    { month: 'Mar', receiving: 460, shipping: 450 },
                    { month: 'Apr', receiving: 590, shipping: 510 },
                    { month: 'May', receiving: 620, shipping: 580 },
                    { month: 'Jun', receiving: 680, shipping: 620 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorReceiving" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShipping" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    domain={[0, 800]}
                    ticks={[0, 200, 400, 600, 800]}
                  />
                  <Tooltip labelStyle={{ color: '#8B5CF6', fontWeight: 700 }} />
                  <Area
                    type="monotone"
                    dataKey="receiving"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fill="url(#colorReceiving)"
                    dot={{ stroke: '#4F46E5', strokeWidth: 2, fill: '#fff', r: 4 }}
                    name="Receiving"
                  />
                  <Area
                    type="monotone"
                    dataKey="shipping"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorShipping)"
                    dot={{ stroke: '#10B981', strokeWidth: 2, fill: '#fff', r: 4 }}
                    name="Shipping"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory by Category</h3>
            <p className="text-sm text-gray-600 mb-4">Stock distribution across categories</p>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { category: 'Electronics', value: 478 },
                    { category: 'Tools', value: 92 },
                    { category: 'Furniture', value: 43 },
                    { category: 'Stationery', value: 275 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#E5E7EB" 
                    vertical={true}
                  />
                  <XAxis 
                    dataKey="category"
                    stroke="#365e52ff"
                    tick={{ fill: '#365e52ff', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    domain={[0, 600]}
                    ticks={[0, 150, 300, 450, 600]}
                  />
                  <Bar
                    dataKey="value"
                    barSize={40}
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  >
                    {/* Add gradient fill for bars */}
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    {/* Custom bar fill */}
                    {[0, 1, 2, 3].map((entry) => (
                      <Cell key={`cell-${entry}`} fill="url(#barGradient)" />
                    ))}
                  </Bar>
                  <Tooltip
                    cursor={false}
                    labelStyle={{ color: '#10B981', fontWeight: 700 }} 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #fff',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}