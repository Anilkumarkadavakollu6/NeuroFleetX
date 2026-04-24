import React, { useState } from "react";
import { Home, Users, BarChart2, Settings, LogOut, CarIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";



const Sidebar = ({menuItems, basePath}) => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout =()=>{
      localStorage.removeItem('token');
      localStorage.removeItem('role');
  
      toast.info("Logged out sucessfully!");
      navigate('/login', {replace:true})
    }

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 shadow-lg border-r border-zinc-200 dark:border-zinc-700 p-6 hidden md:block">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          NeuroFleetX
        </h2>
      </div>

      <nav className="space-y-2 text-sm">
  {menuItems.map(({ id, label, Icon }) => (
    <NavLink
      key={id}
      to={`${basePath}/${id}`}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
          isActive
            ? "bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/40 dark:to-transparent text-blue-600 dark:text-white shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-blue-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex-shrink-0">
            <Icon
              className={`w-5 h-5 ${
                isActive ? "text-blue-600" : "text-zinc-500 dark:text-zinc-300"
              }`}
            />
          </span>
          <span className="flex-1 text-left">{label}</span>
          
          {isActive && (
            <span className="ml-2 text-xs font-medium text-blue-600 dark:text-white">
              ●
            </span>
          )}
        </>
      )}
    </NavLink>
  ))}
</nav>

      <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button onClick={handleLogout} className=" flex items-center gap-2 p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition">
          <LogOut className="w-5 h-5" />
          <span className="flex-1">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
