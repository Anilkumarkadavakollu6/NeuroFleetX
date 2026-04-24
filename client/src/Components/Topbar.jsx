import React, { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { Search, Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Topbar = ({user}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const handleLogout =()=>{
      localStorage.removeItem('token');
      localStorage.removeItem('role');
  
      toast.info("Logged out sucessfully!");
      navigate('/login', {replace:true})
    }
 

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors duration-300">
      <div className="flex items-center gap-12">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {user} Dashboard
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Welcome back — manage your fleet
          </p>
        </div>

        <div className="relative w-80 lg:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-2
               rounded-xl
               bg-zinc-700/60
               text-white
               placeholder:text-zinc-400
               border border-zinc-600
               focus:outline-none
               focus:ring-1 focus:ring-blue-500
               focus:border-blue-500
               transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <ThemeToggle />

        <button className="relative p-2 rounded-md text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-rose-500 rounded-full">
            3
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 hover:shadow-sm transition focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium">
              VC
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm text-zinc-900 dark:text-white">
                Anil 
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {user}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md shadow-lg z-20 overflow-hidden"
              >
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-zinc-100 dark:border-zinc-800" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
