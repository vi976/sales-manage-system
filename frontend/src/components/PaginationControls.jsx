import React from 'react';

function PaginationControls({ page, pageSize, total, onChange }) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const maxVisiblePages = 6;
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <div className="pagination-container">
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`pagination-button ${p === page ? 'pagination-button-active' : ''}`}
          aria-label={`Go to page ${p}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export default PaginationControls;
