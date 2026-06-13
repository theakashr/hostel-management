import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { Users, DollarSign, AlertCircle, QrCode } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Card = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {subtitle && <p className={`text-sm mt-1 font-medium ${colorClass}`}>{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass.replace('text-', 'bg-').replace('500', '100')} bg-opacity-20`}>
        <Icon size={24} className={colorClass} />
      </div>
    </div>
  </div>
);

const COLORS = ['#16A34A', '#F59E0B', '#DC2626']; // Green, Yellow, Red

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, chartRes] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/dashboard/analytics')
        ]);
        setData(dashRes.data);
        setChartData(chartRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data || !chartData) return <div className="text-red-500 text-center mt-10">Error loading admin dashboard. Please ensure you are logged in as an Admin.</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of hostel occupancy, fees, and complaints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="Total Occupancy" 
          value={`${data.totalOccupants}/${data.totalCapacity}`} 
          subtitle={`${data.occupancyRate}% filled`}
          icon={Users} colorClass="text-primary-blue"
        />
        <Card 
          title="Pending Fees" 
          value={`₹${data.pendingFees}`} 
          subtitle="Total outstanding"
          icon={DollarSign} colorClass="text-warning-yellow"
        />
        <Card 
          title="Open Complaints" 
          value={data.openComplaints} 
          subtitle="Requires attention"
          icon={AlertCircle} colorClass="text-alert-red"
        />
        <Card 
          title="Visitor Passes" 
          value={data.passesToday} 
          subtitle="Issued today"
          icon={QrCode} colorClass="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Collection Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.feeChart}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="value"
                >
                  {chartData.feeChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Complaints by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.complaintChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" fill="#1E40AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
