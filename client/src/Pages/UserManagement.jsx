import React, { useState, useEffect } from 'react';
import { Search, Shield, Zap, User, MoreHorizontal, Sparkles, Fingerprint } from 'lucide-react';
import api from '../utils/api';
import AdminLayout from '../Components/AdminLayout';
import Loading from '../Components/Loading';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading/>

  return (
    <AdminLayout>
    <div className="min-h-screen bg-[#fdfdff] dark:bg-[#050505] p-6  font-sans selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-2">
            
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              Users<span className="text-rose-500">.</span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm">Managing {users.length} users</p>
          </div>

        </header>

       
        <div className="grid gap-4">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="group relative flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:dark:bg-zinc-900 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
            >
              <div className="flex items-center gap-6">
                
                <div className="relative">
                  <div className="h-12 w-12 rounded-[1.5rem] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center overflow-hidden shadow-inner">
                    <span className="text-lg font-black text-zinc-400 dark:text-zinc-500">{user.name.charAt(0)}</span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-white dark:border-zinc-900 ${user.role === 'ADMIN' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-rose-500 transition-colors">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] font-bold text-zinc-400 font-mono tracking-tighter">{user.email}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">ID: {user.id}00</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                
                <div className="hidden sm:flex flex-col items-end">
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${
                     user.role === 'ADMIN' 
                     ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' 
                     : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                   }`}>
                     {user.role === 'ADMIN' ? <Shield size={10} /> : <User size={10} />}
                     {user.role}
                   </div>
                </div>

                
                <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:bg-rose-500 hover:text-white transition-all transform group-hover:rotate-90">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="absolute top-1/2 left-4 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          ))}
        </div>

      
      </div>
    </div>
    </AdminLayout>
  );
};

export default UserManagementPage;