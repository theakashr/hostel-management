import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { Users, AlertCircle, QrCode, Calendar } from 'lucide-react';

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

const WardenDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/warden');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading Warden Dashboard...</div>;
  if (!data) return <div className="text-red-500 text-center mt-10">Error loading warden dashboard. Please ensure you are logged in as a Warden.</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Warden Dashboard</h1>
        <p className="text-gray-500 mt-1">Daily overview of hostel occupants, complaints, and requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="Total Occupancy" 
          value={`${data.totalOccupants}/${data.totalCapacity}`} 
          subtitle={`${data.occupancyRate}% filled`}
          icon={Users} colorClass="text-primary-blue"
        />
        <Card 
          title="Open Complaints" 
          value={data.openComplaints} 
          subtitle="Requires attention"
          icon={AlertCircle} colorClass="text-alert-red"
        />
        <Card 
          title="Pending Leaves" 
          value={data.pendingLeaves} 
          subtitle="Awaiting approval"
          icon={Calendar} colorClass="text-warning-yellow"
        />
        <Card 
          title="Visitor Passes" 
          value={data.passesToday} 
          subtitle="Issued today"
          icon={QrCode} colorClass="text-purple-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <p className="text-gray-600 mb-4">Use the sidebar to manage students, approve leaves, resolve complaints, and handle room allocations.</p>
      </div>
    </div>
  );
};

export default WardenDashboard;
