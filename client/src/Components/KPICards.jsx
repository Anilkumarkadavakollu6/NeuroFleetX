import React, { useState, useEffect } from "react";

const gradientMap = {
  blue: "from-blue-600 via-blue-500 to-cyan-400",
  green: "from-emerald-600 via-green-500 to-teal-400",
  red: "from-red-600 via-rose-500 to-pink-400",
  yellow: "from-amber-600 via-yellow-500 to-orange-400",
  purple: "from-purple-600 via-violet-500 to-indigo-400",
  indigo: "from-indigo-600 via-indigo-500 to-blue-400",
  zinc: "from-zinc-700 via-zinc-600 to-zinc-400"
};

const iconBgMap = {
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-emerald-500/20 text-emerald-400",
  red: "bg-red-500/20 text-red-400",
  yellow: "bg-amber-500/20 text-amber-400",
  purple: "bg-purple-500/20 text-purple-400",
  indigo: "bg-indigo-500/20 text-indigo-400",
  zinc: "bg-zinc-500/20 text-zinc-300"
};
const progressGradientMap = {
  blue: "bg-rose-400",
  green: "bg-rose-400",
  red: "bg-rose-400",
  yellow: "bg-rose-400",
  purple: "bg-rose-400",
  indigo: "bg-rose-400",
  zinc: "bg-zinc-300" 
};
const trendColorMap = {
  up: "text-emerald-400",
  down: "text-red-400",
};

const KpiCards = ({
  title,
  value,
  icon,
  trend,
  trendDirection,
  onClick,
  color,
  progress,
  subtitle,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ""));
    if (!isNaN(numValue)) {
      let current = 0;
      const increment = numValue / 20;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setDisplayValue(numValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [value]);

  const gradientClass = gradientMap[color] || gradientMap.blue;
  const iconBgClass = iconBgMap[color] || iconBgMap.blue;
  const progressGradientClass =
    progressGradientMap[color] || progressGradientMap.blue;
  const trendColorClass = trendColorMap[trendDirection] || trendColorMap.up;
  const numValue = parseInt(value.replace(/[^0-9]/g, ""));
  const displayText = isNaN(numValue)
    ? value
    : displayValue + value.substring(String(numValue).length);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-full overflow-hidden rounded-2xl cursor-pointer group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="absolute inset-0 bg-black/10 backdrop-blur-xl" />

      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl`}
      />

      <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium mb-1 tracking-wide uppercase">
              {title}
            </p>
            {subtitle && (
              <p className="text-white/50 text-xs font-light">{subtitle}</p>
            )}
          </div>

          <div
            className={`${iconBgClass} rounded-xl p-2 items-center transform transition-transform duration-300 ${
              isHovered ? "scale-110" : "shadow-2xl"
            }`}
          >
            <div className="text-lg lg:text-xl">{icon}</div>
          </div>
        </div>

        <div className="mb-4">
          <div
            className={`text-4xl lg:text-5xl font-black text-white transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
          >
            {displayText}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-black ${trendColorClass} flex items-center gap-1`}
            >
              <span className="text-lg">
                {trendDirection === "down" ? "↓" : "↑"}
              </span>
              {trend}
            </span>
            <span className={`text-xs  ${trendDirection=== 'up' ? 'text-emerald-400' : 'text-red-400'} font-black uppercase tracking-widest`}>
              {trendDirection === "down" ? "Action Reqd" : "Optimal"}
            </span>
          </div>

         {typeof progress === "number" && (
            <div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-md border border-white/5">
                <div
                  className={`${progressGradientClass} h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
                  style={{
                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                  }}
                />
              </div>
              <span className="text-white/50 text-[10px] uppercase tracking-widest font-bold mt-2 block">
                {Math.round(progress)}% of fleet target
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-all duration-300" />
    </div>
  );
};

export default KpiCards;


