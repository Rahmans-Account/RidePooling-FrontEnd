import React, { useState } from "react";
import axios from "axios";
import { Search, MapPin, Loader2, Navigation, Compass } from "lucide-react";
import authService from "../services/authService";

export default function AutoCompleteLocation({
  label,
  onSelect,
  onTyping,
  biasSuffix = null, // if null, fallback to user city. if empty string, no bias.
  viewbox = "",
  bounded = false,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  // fetch suggestions from Nominatim API
  const fetchSuggestions = async (value) => {
    setLoading(true);
    try {
      let suffix = biasSuffix;
      if (suffix === null) {
        const user = authService.getCurrentUser();
        suffix = user?.city || "";
      }

      const queryParams = {
        q: suffix ? `${value} ${suffix}` : value,
        format: "json",
        addressdetails: 1,
        limit: 5,
        countrycodes: "in",
      };

      if (viewbox) {
        queryParams.viewbox = viewbox;
      }
      if (bounded) {
        queryParams.bounded = 1;
      }

      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: queryParams,
          headers: {
            "User-Agent": "RidePoolingApp/1.0",
          },
        }
      );

      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // handle typing
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // 🔹 call parent's onTyping to clear error
    if (onTyping) onTyping();

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (value.length > 2) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
      setDebounceTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  };

  // handle selection
  const handleSelect = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    onSelect({
      name: place.display_name,
      latitude: Number(place.lat),
      longitude: Number(place.lon),
    });
  };

  return (
    <div className="relative group/search">
      <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-2 mb-3 flex items-center gap-2">
         <Compass size={14} className="text-pastel-lavender-dark" /> {label}
      </label>
      
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-pastel-lavender-dark transition-colors pointer-events-none">
           {loading ? <Loader2 size={20} className="animate-spin" strokeWidth={3} /> : <Search size={20} strokeWidth={3} />}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={`Input ${label.toLowerCase()} vector...`}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-white rounded-[2rem] outline-none transition-all font-black text-sm tracking-tight shadow-sm focus:border-pastel-lavender focus:ring-4 focus:ring-pastel-lavender-light/30 focus:shadow-md"
        />

        {query && !loading && (
           <div className="absolute right-5 top-1/2 -translate-y-1/2">
             <div className="w-2 h-2 rounded-full bg-pastel-mint animate-pulse" />
           </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute bg-white/90 backdrop-blur-xl border-2 border-white rounded-[2.5rem] shadow-2xl w-full mt-4 max-h-72 overflow-y-auto z-[9999] p-4 space-y-2 animate-in slide-in-from-top-4">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4 ml-4">Coordinate Suggestion</p>
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="px-6 py-4 hover:bg-pastel-lavender-light/30 rounded-2xl cursor-pointer text-sm transition-all group/item flex items-center gap-4"
            >
              <div className="p-2 bg-white rounded-xl border border-white shadow-sm group-hover/item:scale-110 transition-transform">
                 <MapPin size={16} className="text-pastel-lavender-dark" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800 truncate tracking-tight">{place.display_name.split(',')[0]}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight opacity-70">
                    {place.display_name.split(',').slice(1).join(',')}
                </p>
              </div>
              <Navigation size={14} className="text-pastel-mint-dark opacity-0 group-hover/item:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
