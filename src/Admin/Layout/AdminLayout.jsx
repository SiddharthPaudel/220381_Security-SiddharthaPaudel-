import React from 'react';
import AdminSidebar from "../Sidebar/AdminSidebar"
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-[Montserrat]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e1e1e]">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
