import React from 'react';
import { NavLink } from 'react-router-dom';
import useStore from '../store/useStore';
import { Home, Users, DollarSign, AlertCircle, Calendar, QrCode, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useStore();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/room', label: 'My Room', icon: Users },
    { to: '/fees', label: 'Fees', icon: DollarSign },
    { to: '/complaints', label: 'Complaints', icon: AlertCircle },
    { to: '/leaves', label: 'Leave Requests', icon: Calendar },
    { to: '/passes', label: 'Visitor Passes', icon: QrCode },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/rooms', label: 'Room Allocation', icon: Users }, // we can use an icon
    { to: '/admin/fees', label: 'Fee Management', icon: DollarSign },
    { to: '/admin/complaints', label: 'Complaints', icon: AlertCircle },
  ];

  const links = user?.role === 'admin' || user?.role === 'warden' ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen hidden md:flex flex-col sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-blue tracking-tight">HostelHub</h1>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-blue text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-blue'
                }`
              }
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-gray-600 hover:bg-gray-50 hover:text-alert-red rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
