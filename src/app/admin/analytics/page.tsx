"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CreditCard, DollarSign, ShoppingCart, Users, Package, TrendingUp, BarChart2 } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Mock data - replace with actual data fetching
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: '2023',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
};

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Revenue',
      data: [4500, 7200, 6800, 9500, 11000, 12500, 11800],
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
};

const topProducts = [
  { name: 'Wireless Earbuds', sales: 1245, revenue: 18675 },
  { name: 'Smart Watch', sales: 987, revenue: 15792 },
  { name: 'Bluetooth Speaker', sales: 765, revenue: 11475 },
  { name: 'Phone Case', sales: 1200, revenue: 7200 },
  { name: 'USB-C Cable', sales: 1100, revenue: 3300 },
];

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: DollarSign },
  { title: 'Total Orders', value: '2,345', change: '+12% from last month', icon: ShoppingCart },
  { title: 'Customers', value: '1,234', change: '+8.5% from last month', icon: Users },
  { title: 'Products', value: '567', change: '+4.3% from last month', icon: Package },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your store's performance and customer insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Bar 
                  data={salesData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          callback: (value) => `$${value}`,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue growth</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Line 
                  data={revenueData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          callback: (value) => `$${value}`,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} units sold
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ${product.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in your store</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { id: 1, user: 'John Doe', action: 'placed a new order', time: '2 minutes ago', amount: '$125.00' },
                { id: 2, user: 'Jane Smith', action: 'signed up', time: '1 hour ago', amount: '' },
                { id: 3, user: 'Robert Johnson', action: 'wrote a review', time: '3 hours ago', amount: '' },
                { id: 4, user: 'System', action: 'scheduled maintenance', time: '5 hours ago', amount: '' },
                { id: 5, user: 'Emily Davis', action: 'completed checkout', time: '1 day ago', amount: '$89.50' },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user} <span className="text-muted-foreground font-normal">{activity.action}</span>
                      {activity.amount && <span className="ml-2 text-green-600">{activity.amount}</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Channels</CardTitle>
                <CardDescription>Revenue by channel</CardDescription>
              </div>
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { channel: 'Online Store', value: 65, color: 'bg-blue-500' },
                { channel: 'Mobile App', value: 25, color: 'bg-green-500' },
                { channel: 'In-Store', value: 10, color: 'bg-purple-500' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.channel}</span>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`} 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
