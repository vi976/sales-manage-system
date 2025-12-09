import React from 'react';

const options = [
  { field: 'Customer Name', label: 'Customer Name (A-Z)', dir: 'asc' },
  { field: 'Date', label: 'Date (Newest First)', dir: 'desc' },
  { field: 'Quantity', label: 'Quantity', dir: 'desc' }
];

function SortDropdown({ field, dir, onChange }) {
  return (
    <div className="sort-dropdown-wrapper">
      <select
        value={options.findIndex(o => o.field===field && o.dir===dir)}
        className="sort-select"
        onChange={e => {
          const idx = Number(e.target.value);
          const opt = options[idx];
          onChange(opt.field, opt.dir);
        }}
        aria-label="Sort by"
      >
        {options.map((opt, i) => (
          <option key={i} value={i}>{opt.label}</option>
        ))}
      </select>
      <span className="sort-arrow">▼</span>
    </div>
  );
}

export default SortDropdown;
