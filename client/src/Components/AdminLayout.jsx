import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router";
import { BarChart2, CarIcon, Home, Settings, Users } from "lucide-react";
import { ADMIN_MENU } from "./RoleConfig";


const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen flex bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      <Sidebar menuItems={ADMIN_MENU} basePath="/admin" />

      <div className="flex-1 flex flex-col">
        <Topbar user = {"Admin"}/>

        <main className="p-6 flex-1 overflow-auto h-full">{children}
        <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
