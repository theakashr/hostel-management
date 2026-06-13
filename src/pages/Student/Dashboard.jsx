import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { Users, DollarSign, AlertCircle, Calendar } from 'lucide-react';

const Card = ({ title, value, subtitle, icon: Icon, colorClass, linkTo }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
    {linkTo && (
      <Link to={linkTo} className="mt-4 block text-sm font-medium text-primary-blue hover:underline">
        View details &rarr;
      </Link>
    )}
  </div>
);

const StudentDashboard = () => {
  const { user } = useStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/student');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse flex space-x-4">Loading dashboard...</div>;

  const { studentDetails, latestFee, pendingComplaints, pendingLeaves } = data;
  const roomName = studentDetails?.roomId ? studentDetails.roomId.roomNumber : 'Unassigned';
  const feeStatusText = latestFee 
    ? (latestFee.status === 'paid' ? 'All Paid' : `₹${latestFee.amountDue} due`)
    : 'No dues';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your hostel account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="My Room" 
          value={roomName} 
          subtitle={studentDetails?.roomId ? `${studentDetails.roomId.blockName}` : 'Pending allocation'}
          icon={Users} 
          colorClass="text-primary-blue"
          linkTo="/room"
        />
        <Card 
          title="Fee Status" 
          value={latestFee ? `₹${latestFee.amountDue}` : '₹0'} 
          subtitle={feeStatusText}
          icon={DollarSign} 
          colorClass={latestFee?.status === 'paid' ? 'text-accent-green' : 'text-warning-yellow'}
          linkTo="/fees"
        />
        <Card 
          title="Pending Complaints" 
          value={pendingComplaints} 
          subtitle={pendingComplaints === 0 ? 'All good' : 'Requires attention'}
          icon={AlertCircle} 
          colorClass={pendingComplaints === 0 ? 'text-accent-green' : 'text-alert-red'}
          linkTo="/complaints"
        />
        <Card 
          title="Pending Leaves" 
          value={pendingLeaves} 
          subtitle={pendingLeaves === 0 ? 'No active requests' : 'Awaiting approval'}
          icon={Calendar} 
          colorClass="text-purple-500"
          linkTo="/leaves"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Announcements</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <h4 className="font-semibold text-primary-blue">Hostel Fees Deadline Extended</h4>
              <p className="text-sm text-gray-600 mt-1">The deadline for May 2024 fees has been extended to 5th June without late fees.</p>
              <span className="text-xs text-gray-400 mt-2 block">2 days ago</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <h4 className="font-semibold text-gray-800">Routine Maintenance Schedule</h4>
              <p className="text-sm text-gray-600 mt-1">AC maintenance will be carried out in Block A on this weekend.</p>
              <span className="text-xs text-gray-400 mt-2 block">4 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="space-y-3">
            <Link to="/passes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-md"><QrCode size={20} className="text-primary-blue" /></div>
              <span className="font-medium text-gray-700">Generate Visitor Pass</span>
            </Link>
            <Link to="/complaints" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="bg-red-100 p-2 rounded-md"><AlertCircle size={20} className="text-alert-red" /></div>
              <span className="font-medium text-gray-700">File a Complaint</span>
            </Link>
            <Link to="/fees" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="bg-green-100 p-2 rounded-md"><DollarSign size={20} className="text-accent-green" /></div>
              <span className="font-medium text-gray-700">Pay Fees</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
