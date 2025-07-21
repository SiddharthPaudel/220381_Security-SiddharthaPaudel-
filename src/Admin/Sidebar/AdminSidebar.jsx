import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
    { name: "Users", icon: <FaUsers />, path: "/admin/usertable" },
    { name: "Add Comic", icon: <FaBoxOpen />, path: "/admin/addmanga" },
     { name: "Add Chapters", icon: <FaBoxOpen />, path: "/admin/addchapter" },
    { name: "Rental", icon: <FaUsers />, path: "/admin/rental" },
    { name: "Comic", icon: <FaUsers />, path: "/admin/manga" },


    { name: "Logout", icon: <FaSignOutAlt />, path: "/" },
  ];

  return (
    <div className="h-screen w-64 bg-[#1e1e1e] text-white shadow-md fixed top-0 left-0 flex flex-col">
      <div className="text-2xl font-bold text-center py-6 border-b border-gray-700">
        Admin Panel
      </div>
      <div className="flex-grow p-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 my-2 rounded-lg hover:bg-gray-700 transition ${
              location.pathname === item.path ? "bg-gray-700" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
