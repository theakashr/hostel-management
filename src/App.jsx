import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import ToastManager from './components/ToastManager';

import StudentDashboard from './pages/Student/Dashboard';
import Room from './pages/Student/Room';
import Fees from './pages/Student/Fees';
import Complaints from './pages/Student/Complaints';
import Leaves from './pages/Student/Leaves';
import Passes from './pages/Student/VisitorPasses';

// Placeholder Pages for Admin
import AdminDashboard from './pages/Admin/Dashboard';
import Students from './pages/Admin/Students';
import RoomAllocation from './pages/Admin/RoomAllocation';

import WardenDashboard from './pages/Warden/Dashboard';

function App() {
  const { loadUser, loading, isAuthenticated, user } = useStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user.role === 'student' ? '/dashboard' : (user.role === 'warden' ? '/warden/dashboard' : '/admin/dashboard')} />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={isAuthenticated ? (user.role === 'student' ? '/dashboard' : (user.role === 'warden' ? '/warden/dashboard' : '/admin/dashboard')) : '/login'} />} />
          
          {/* Student Routes */}
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="room" element={<Room />} />
          <Route path="fees" element={<Fees />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="passes" element={<Passes />} />

          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/students" element={<Students />} />
          <Route path="admin/rooms" element={<RoomAllocation />} />
          <Route path="admin/fees" element={<div>Fee Management (Coming Soon)</div>} />
          
          {/* Warden Routes */}
          <Route path="warden/dashboard" element={<WardenDashboard />} />
          <Route path="warden/complaints" element={<div>Warden Complaints (Coming Soon)</div>} />
        </Route>
      </Routes>
      {!isAuthenticated && <ToastManager />}
    </Router>
  );
}

export default App;
