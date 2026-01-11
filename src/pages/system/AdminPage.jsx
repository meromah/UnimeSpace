import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

/**
 * AdminPage Component
 * 
 * Layout component for admin pages, similar to UserPage.
 * Includes AdminSidebar and main content area.
 */
const AdminPage = () => {
  const location = useLocation();

  return (
    <div className="relative h-full md:min-h-screen grid grid-cols-12 dark:bg-neutral-950">
      {/* Left Sidebar */}
      <aside className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-3 border-r border-neutral-200 dark:border-neutral-700 md:h-screen md:sticky md:top-0 overflow-y-scroll scrollbar-hide">
        <AdminSidebar />
      </aside>

      {/* Main Section */}
      <main className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-9">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;