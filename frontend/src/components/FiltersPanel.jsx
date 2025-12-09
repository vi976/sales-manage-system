import React, { useRef, useState } from 'react';

const regionsList = ['North', 'South', 'East', 'West', 'Central'];
const genderList = ['Male', 'Female'];
const paymentMethodList = ['UPI', 'Credit Card', 'Debit Card', 'Wallet', 'Cash'];
const categoryList = ['Clothing', 'Beauty', 'Electronics'];
const tagsList = [
  'fashion', 'casual', 'unisex', 'organic', 'skincare', 'makeup',
  'gadgets', 'portable', 'wireless', 'accessories', 'cotton', 'smart'
];

function arrayToggle(list, value) {
  return list.includes(value)
    ? list.filter(v => v !== value)
    : [...list, value];
}

function FiltersPanel({ filters, setFilters }) {
  // State for popovers
  const [openPopover, setOpenPopover] = useState(null);
  const regionRef = useRef();
  const genderRef = useRef();
  const ageRef = useRef();
  const categoryRef = useRef();
  const tagsRef = useRef();
  const paymentRef = useRef();
  const dateRef = useRef();

  const refs = {
    region: regionRef,
    gender: genderRef,
    age: ageRef,
    category: categoryRef,
    tags: tagsRef,
    payment: paymentRef,
    date: dateRef
  };

  React.useEffect(() => {
    function close(e) {
      Object.keys(refs).forEach(key => {
        if (openPopover === key && refs[key].current && !refs[key].current.contains(e.target)) {
          setOpenPopover(null);
        }
      });
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openPopover]);

  const getActiveCount = (list) => list.length;
  const getActiveLabel = (list, allOptions) => {
    if (list.length === 0) return '';
    if (list.length === 1) return list[0];
    if (list.length === allOptions.length) return 'All';
    return `${list.length} selected`;
  };

  return (
    <div className="chip-filters-row" role="toolbar" aria-label="Filters">
      {/* Customer Region */}
      <span style={{ position: 'relative' }} ref={regionRef}>
        <button
          className={`filter-chip${getActiveCount(filters.regions) > 0 ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'region' ? null : 'region')}
          type="button"
          aria-label="Filter by Customer Region"
        >
          Customer Region {getActiveCount(filters.regions) > 0 && `(${getActiveCount(filters.regions)})`}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'region' && (
          <div className="chip-popover">
            {regionsList.map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.regions.includes(opt)}
                  onChange={() => setFilters({ ...filters, regions: arrayToggle(filters.regions, opt) })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </span>

      {/* Gender */}
      <span style={{ position: 'relative' }} ref={genderRef}>
        <button
          className={`filter-chip${getActiveCount(filters.genders) > 0 ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'gender' ? null : 'gender')}
          type="button"
        >
          Gender {getActiveCount(filters.genders) > 0 && `(${getActiveCount(filters.genders)})`}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'gender' && (
          <div className="chip-popover">
            {genderList.map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.genders.includes(opt)}
                  onChange={() => setFilters({ ...filters, genders: arrayToggle(filters.genders, opt) })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </span>

      {/* Age Range */}
      <span style={{ position: 'relative' }} ref={ageRef}>
        <button
          className={`filter-chip${(filters.ageMin || filters.ageMax) ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'age' ? null : 'age')}
          type="button"
        >
          Age Range {filters.ageMin || filters.ageMax ? `(${filters.ageMin || ''}${filters.ageMin && filters.ageMax ? '-' : ''}${filters.ageMax || ''})` : ''}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'age' && (
          <div className="chip-popover">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                min={0}
                max={200}
                placeholder="Min"
                value={filters.ageMin}
                onChange={e => setFilters({ ...filters, ageMin: e.target.value })}
                style={{ width: 70, padding: '6px 8px', border: '1px solid #d3d7db', borderRadius: 4 }}
              />
              <span>-</span>
              <input
                type="number"
                min={0}
                max={200}
                placeholder="Max"
                value={filters.ageMax}
                onChange={e => setFilters({ ...filters, ageMax: e.target.value })}
                style={{ width: 70, padding: '6px 8px', border: '1px solid #d3d7db', borderRadius: 4 }}
              />
            </div>
          </div>
        )}
      </span>

      {/* Product Category */}
      <span style={{ position: 'relative' }} ref={categoryRef}>
        <button
          className={`filter-chip${getActiveCount(filters.categories) > 0 ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'category' ? null : 'category')}
          type="button"
        >
          Product Category {getActiveCount(filters.categories) > 0 && `(${getActiveCount(filters.categories)})`}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'category' && (
          <div className="chip-popover">
            {categoryList.map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.categories.includes(opt)}
                  onChange={() => setFilters({ ...filters, categories: arrayToggle(filters.categories, opt) })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </span>

      {/* Tags */}
      <span style={{ position: 'relative' }} ref={tagsRef}>
        <button
          className={`filter-chip${getActiveCount(filters.tags) > 0 ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'tags' ? null : 'tags')}
          type="button"
        >
          Tags {getActiveCount(filters.tags) > 0 && `(${getActiveCount(filters.tags)})`}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'tags' && (
          <div className="chip-popover" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {tagsList.map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.tags.includes(opt)}
                  onChange={() => setFilters({ ...filters, tags: arrayToggle(filters.tags, opt) })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </span>

      {/* Payment Method */}
      <span style={{ position: 'relative' }} ref={paymentRef}>
        <button
          className={`filter-chip${getActiveCount(filters.paymentMethods) > 0 ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'payment' ? null : 'payment')}
          type="button"
        >
          Payment Method {getActiveCount(filters.paymentMethods) > 0 && `(${getActiveCount(filters.paymentMethods)})`}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'payment' && (
          <div className="chip-popover">
            {paymentMethodList.map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.paymentMethods.includes(opt)}
                  onChange={() => setFilters({ ...filters, paymentMethods: arrayToggle(filters.paymentMethods, opt) })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </span>

      {/* Date */}
      <span style={{ position: 'relative' }} ref={dateRef}>
        <button
          className={`filter-chip${(filters.dateFrom || filters.dateTo) ? ' chip-active' : ''}`}
          onClick={() => setOpenPopover(openPopover === 'date' ? null : 'date')}
          type="button"
        >
          Date {filters.dateFrom || filters.dateTo ? `(${filters.dateFrom || ''}${filters.dateFrom && filters.dateTo ? ' - ' : ''}${filters.dateTo || ''})` : ''}
          <span style={{ marginLeft: '4px', fontSize: '10px' }}>▼</span>
        </button>
        {openPopover === 'date' && (
          <div className="chip-popover">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                style={{ padding: '6px 8px', border: '1px solid #d3d7db', borderRadius: 4 }}
              />
              <span>-</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                style={{ padding: '6px 8px', border: '1px solid #d3d7db', borderRadius: 4 }}
              />
            </div>
          </div>
        )}
      </span>
    </div>
  );
}

export default FiltersPanel;
