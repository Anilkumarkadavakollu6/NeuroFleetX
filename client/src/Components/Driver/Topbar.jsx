import React, { useEffect, useState, useRef } from "react";
import { FiTruck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Battery,
  Clock2Icon,
  LogOut,
  MapPin,
  Settings,
  User,
  Wifi,
  ChevronDown,
  BatteryMedium,
  CarTaxiFront,
} from "lucide-react";
import { replace, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Topbar = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout =()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    toast.success("Logged out sucessfully!");
    navigate('/login', {replace:true})
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className = "w-full sticky top-0 z-50"
    >
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl dark:bg-zinc-900 bg-white border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/15 transition-colors duration-300" />
              <CarTaxiFront className="w-5 h-5 text-blue-500 relative z-10" />
            </div>

            <div>
              <h1 className="text-sm font-bold text-white dark:from-white dark:to-zinc-300 tracking-tight">
                Driver <span className="text-rose-400">Dashboard</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Swift LXI •Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="hidden md:flex items-center h-10 px-4 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>NH-58 Meerut, UP</span>
            </div>

            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-4" />

            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
              <Clock2Icon className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-mono tracking-tight text-blue-600 dark:text-blue-400">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-4" />

            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <div className="flex items-center gap-1">
                <BatteryMedium className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[11px] font-mono font-medium text-green-600 dark:text-green-400">
                  86%
                </span>
              </div>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 cursor-pointer pl-1.5 pr-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-inner">
                VC
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[13px] font-semibold text-zinc-900 dark:text-white leading-none">
                  V
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Admin
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 ml-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+12px)] w-48 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl shadow-2xl z-20 overflow-hidden"
                >
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
                      <Settings className="w-4 h-4 text-zinc-400" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-zinc-100 dark:border-zinc-800" />
                  <div className="p-1.5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </motion.header>
  );
};

export default Topbar;
