import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  X,
  Loader2,
  MapIcon,
  Clock10,
  MapPinCheckInsideIcon,
} from "lucide-react";

const LocationInput = ({
  label,
  icon: Icon,
  placeholder,
  value,
  onSelect,
  onClear,
  iconColor,
  accentRing,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debounceTimer = useRef(null);

  const fetchSuggestions = useCallback((q) => {
    if (q.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError("");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1&email=dev@neurofleet.com`;
      //const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6`;

      fetch(url, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          Accept: "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network error");
          return res.json();
        })
        .then((data) => {
          setSuggestions(data);
          setShowDropdown(true);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setError("Failed to fetch location suggestions");
          setSuggestions([]);
        });
    }, 800);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (item) => {
    const loc = {
      name: (item.display_name || "").split(",")[0],
      displayName: item.display_name || "",
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };
    setQuery(loc.name);
    setShowDropdown(false);
    setSuggestions([]);
    setError("");
    onSelect(loc);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setError("");
    onClear();
  };

  return (
    <div ref={containerRef} className="relative group">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <div
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor} transition-colors`}
        >
          <MapPinCheckInsideIcon size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-10 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 ${accentRing} transition-all text-sm`}
        />
        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <Loader2 size={16} className="text-cyan-400 animate-spin" />
          </div>
        )}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-1 pl-1">{error}</p>}

      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[9999] w-full mt-1.5 bg-slate-800/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl shadow-black/40 overflow-hidden max-h-64 overflow-y-auto"
          >
            {suggestions.map((item, i) => (
              <button
                key={`${item.place_id || i}`}
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-3 text-left hover:bg-cyan-500/10 transition-all border-b border-slate-700/30 last:border-0 group/item"
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    size={15}
                    className={`mt-0.5 ${iconColor} flex-shrink-0 opacity-60 group-hover/item:opacity-100 transition-opacity`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate group-hover/item:text-cyan-300 transition-colors">
                      {(item.display_name || "").split(",")[0]}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight">
                      {item.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationInput;
