// src/components/Layout.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This renders the matched route’s component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
