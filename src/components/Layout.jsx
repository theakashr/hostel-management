import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastManager from './ToastManager';

const Layout = () => {
  const { isAuthenticated, loading } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastManager />
    </div>
  );
};

export default Layout;
