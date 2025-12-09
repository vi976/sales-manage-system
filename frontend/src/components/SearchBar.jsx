import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        value={value}
        placeholder="Name, Phone no."
        className="search-input"
        onChange={e => onChange(e.target.value)}
        aria-label="Search by name or phone number"
      />
      <Search className="search-icon" size={18} />
    </div>
  );
}

export default SearchBar;
