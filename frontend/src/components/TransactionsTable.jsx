import React from 'react';

function formatAmount(val) {
  if (!val || isNaN(val)) return '—';
  return `₹ ${Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function fmt(val) {
  if (val === null || val === undefined) return '—';
  const str = String(val);
  return str.trim() ? str : '—';
}
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  // Force YYYY-MM-DD
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

// EXACT 13 columns in this order as per requirements
const COLS = [
  { key: 'Transaction ID', label: 'Transaction ID', width: 130, align: 'left' },
  { key: 'Date', label: 'Date', width: 110, align: 'left', format: formatDate },
  { key: 'Customer ID', label: 'Customer ID', width: 130, align: 'left' },
  { key: 'Customer Name', label: 'Customer name', width: 150, align: 'left' },
  { key: 'Phone Number', label: 'Phone Number', width: 150, align: 'left' },
  { key: 'Gender', label: 'Gender', width: 90, align: 'left' },
  { key: 'Age', label: 'Age', width: 70, align: 'left' },
  { key: 'Product Category', label: 'Product Category', width: 150, align: 'left' },
  { key: 'Quantity', label: 'Quantity', width: 90, align: 'left' },
  { key: 'Total Amount', label: 'Total Amount', width: 130, align: 'right', format: formatAmount },
  { key: 'Customer Region', label: 'Customer region', width: 140, align: 'left' },
  { key: 'Product ID', label: 'Product ID', width: 120, align: 'left' },
  { key: 'Employee Name', label: 'Employee name', width: 150, align: 'left' }
];

function TransactionsTable({ loading, data, error }) {
  // Defensive: Normalize data source - handle both direct array and object with results property
  const normalizeData = (source) => {
    if (Array.isArray(source)) {
      return source;
    }
    if (source && Array.isArray(source.results)) {
      return source.results;
    }
    if (source && Array.isArray(source.sales)) {
      return source.sales;
    }
    return [];
  };

  // Always normalize to array
  const rows = normalizeData(data);
  const hasRows = Array.isArray(rows) && rows.length > 0;

  // Safe accessor for row values
  const getRowValue = (row, key) => {
    if (!row || typeof row !== 'object') return null;
    // Try exact key match first
    if (row.hasOwnProperty(key)) {
      return row[key];
    }
    // Handle 'Total Amount' fallback to 'Final Amount'
    if (key === 'Total Amount' && row.hasOwnProperty('Final Amount')) {
      return row['Final Amount'];
    }
    return null;
  };

  // Scrollable horizontally on small screens, fixed header
  return (
    <div className="table-container">
      <table role="table" className="transactions-table" aria-label="Sales Transactions Table">
        <thead role="rowgroup" className="table-header">
          <tr role="row">
            {COLS.map(col => (
              <th 
                role="columnheader" 
                key={col.key} 
                className="table-header-cell" 
                style={{ textAlign: col.align || 'left' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {loading && (
            <tr role="row">
              <td colSpan={COLS.length} className="table-empty-state" role="cell">
                Loading sales data...
              </td>
            </tr>
          )}
          {error && (
            <tr role="row">
              <td colSpan={COLS.length} className="table-error-state" role="cell">
                {error || 'Failed to load data'}
              </td>
            </tr>
          )}
          {!loading && !error && !hasRows && (
            <tr role="row">
              <td colSpan={COLS.length} className="table-empty-state" role="cell">
                No results found.
              </td>
            </tr>
          )}
          {!loading && !error && hasRows && rows.map((row, i) => {
            // Additional safety check for row
            if (!row || typeof row !== 'object') {
              return null;
            }
            return (
              <tr 
                role="row" 
                key={row['Transaction ID'] || `row-${i}`} 
                className={`table-row ${i % 2 === 1 ? 'table-row-striped' : ''}`}
              >
                {COLS.map(col => {
                  try {
                    const value = getRowValue(row, col.key);
                    return (
                      <td 
                        role="cell" 
                        key={col.key} 
                        className="table-cell" 
                        style={{ textAlign: col.align || 'left' }}
                      >
                        {col.format ? col.format(value) : fmt(value)}
                      </td>
                    );
                  } catch (err) {
                    // Fallback for any unexpected errors
                    console.warn(`Error rendering cell ${col.key} for row ${i}:`, err);
                    return (
                      <td 
                        role="cell" 
                        key={col.key} 
                        className="table-cell" 
                        style={{ textAlign: col.align || 'left' }}
                      >
                        —
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
