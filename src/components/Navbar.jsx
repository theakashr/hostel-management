import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Menu, X } from 'lucide-react';

const Navbar = ({ toggleMobileMenu }) => {
  const { user } = useStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 md:hidden">HostelHub</h2>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold shadow-sm">
          {user?.fullName?.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
