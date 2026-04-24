import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Map, History, User, LogOut } from "lucide-react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { USER_MENU } from "./RoleConfig";

const UserLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="h-screen flex bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      <Sidebar menuItems={USER_MENU} basePath="/USER" />

      <div className="flex-1 flex flex-col">
        <Topbar user={"User"} />

        <main className="p-6 flex-1 overflow-auto h-full">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
