import React from "react";

const AdminCards = ({
  title,
  desc,
  icon: Icon,
  stats,
  trend,
  gradientFrom = "from-blue-500",
  gradientTo = "to-cyan-500",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-2">
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />

      <div className="relative p-8 z-10">
        {Icon && (
          <div className="mb-6">
            <div
              className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg group-hover:shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        )}

        {trend !== undefined && (
          <div className="absolute top-8 right-8 flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <span
              className={`text-sm font-bold ${
                trend > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          </div>
        )}

       
        {stats && (
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3 group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 transition-all duration-500">
            {stats}
          </div>
        )}

        
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

       
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-300">
          {desc}
        </p>


        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-300 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            View Details
          </span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-white font-bold text-sm">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCards;
