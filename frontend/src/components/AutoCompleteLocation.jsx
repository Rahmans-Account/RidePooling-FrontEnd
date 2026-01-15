import React, { useState } from "react";
import axios from "axios";

export default function AutoCompleteLocation({ label, onSelect, onTyping }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // fetch suggestions from Nominatim API
  const fetchSuggestions = async (value) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${value} Telangana`, // bias search toward Telangana
            format: "json",
            addressdetails: 1,
            limit: 5,
            countrycodes: "in",
            viewbox: "77.0,19.5,82.0,15.5", // roughly Telangana
            bounded: 1,
          },
          headers: {
            "User-Agent": "RidePoolingApp/1.0 (your-email@example.com)",
          },
        }
      );

      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // handle typing
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // 🔹 call parent's onTyping to clear error
    if (onTyping) onTyping();

    if (value.length > 2) {
      fetchSuggestions(value);
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
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full p-2 border rounded-md"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded-md shadow-md w-full mt-1 max-h-48 overflow-y-auto z-10">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
