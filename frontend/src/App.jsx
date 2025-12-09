import React from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import FiltersPanel from './components/FiltersPanel';
import SortDropdown from './components/SortDropdown';
import TransactionsTable from './components/TransactionsTable';
import PaginationControls from './components/PaginationControls';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  LayoutDashboard, 
  Network, 
  PlayCircle, 
  Play, 
  CheckSquare, 
  X, 
  Clock, 
  FileText 
} from 'lucide-react';

// Example KPI calculation helpers
function getKPIs(data) {
  let totalUnits = 0, totalAmount = 0, totalDiscount = 0, countAmt = 0, countDisc = 0;
  (data||[]).forEach(row => {
    if (!isNaN(Number(row.Quantity))) totalUnits += Number(row.Quantity);
    if (!isNaN(Number(row['Final Amount']))) { totalAmount += Number(row['Final Amount']); countAmt++; }
    if (!isNaN(Number(row['Discount Percentage'])) && !isNaN(Number(row['Total Amount']))) {
      totalDiscount += Number(row['Total Amount']) * Number(row['Discount Percentage']) / 100;
      countDisc++;
    }
  });
  return {
    totalUnits,
    totalAmount,
    totalDiscount,
    countAmt,
    countDisc
  };
}

function App(props) {
  // UI state as before
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState({ regions: [], genders: [], ageMin: '', ageMax: '', categories: [], tags: [], paymentMethods: [], dateFrom: '', dateTo: '' });
  const [sortField, setSortField] = React.useState('Customer Name');
  const [sortDir, setSortDir] = React.useState('asc');
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const params = {
      search,
      ...filters,
      sortField,
      sortDir,
      page
    };
    setLoading(true);
    import('./services/api').then(({ fetchSales }) => {
      fetchSales(params)
        .then(res => {
          setData(res.results || []);
          setTotal(res.total || 0);
          setError("");
        })
        .catch(() => setError("Failed to load data from backend."))
        .finally(() => setLoading(false));
    });
  }, [search, filters, sortField, sortDir, page]);

  // KPI calculations
  const kpis = getKPIs(data);

  // Layout: fixed sidebar, main content with title (left) and search (right), filters row, KPIs, table, pagination
  return (
    <div className="main-app-bg">
      <aside className="sidebar-vert">
        <div className="sidebar-profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="profile-avatar">V</div>
            <div>
              <div className="profile-label">Vault</div>
              <div className="profile-name">Anurag Yadav</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item">
            <LayoutDashboard className="nav-icon" size={20} />
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item">
            <Network className="nav-icon" size={20} />
            <span className="nav-text">Nexus</span>
          </div>
          <div className="nav-item">
            <PlayCircle className="nav-icon" size={20} />
            <span className="nav-text">Intake</span>
          </div>
          <div className="nav-section-label">Services</div>
          <div className="nav-item">
            <Play className="nav-icon" size={20} />
            <span className="nav-text">Pre-active</span>
          </div>
          <div className="nav-item">
            <CheckSquare className="nav-icon" size={20} />
            <span className="nav-text">Active</span>
          </div>
          <div className="nav-item">
            <X className="nav-icon" size={20} />
            <span className="nav-text">Blocked</span>
          </div>
          <div className="nav-item">
            <Clock className="nav-icon" size={20} />
            <span className="nav-text">Closed</span>
          </div>
          <div className="nav-section-label">Invoices</div>
          <div className="nav-item">
            <FileText className="nav-icon" size={20} />
            <span className="nav-text">Proforma Invoices</span>
          </div>
          <div className="nav-item">
            <FileText className="nav-icon" size={20} />
            <span className="nav-text">Final Invoices</span>
          </div>
        </nav>
      </aside>
      <div className="main-content-container">
        <div className="content-header">
          <h1 className="page-title">Sales Management System</h1>
          <div className="header-search">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
        <div className="filters-sort-row">
          <div className="filters-with-reset">
            <button 
              className="reset-filters-btn" 
              onClick={() => setFilters({ regions: [], genders: [], ageMin: '', ageMax: '', categories: [], tags: [], paymentMethods: [], dateFrom: '', dateTo: '' })}
              aria-label="Reset all filters"
              title="Reset all filters"
            >
              ↻
            </button>
            <FiltersPanel filters={filters} setFilters={setFilters} />
          </div>
          <div className="sort-wrapper">
            <span className="sort-label">Sort by:</span>
            <SortDropdown field={sortField} dir={sortDir} onChange={(f, d) => { setSortField(f); setSortDir(d); setPage(1); }} />
          </div>
        </div>
        <div className="kpi-card-row">
          <div className="kpi-card">
            <div className="kpi-label">
              Total units sold
              <span className="kpi-info-icon" title="Total units sold">ℹ️</span>
            </div>
            <div className="kpi-value">{kpis.totalUnits || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              Total Amount
              <span className="kpi-info-icon" title="Total Amount">ℹ️</span>
            </div>
            <div className="kpi-value">₹{kpis.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} {kpis.countAmt>0 && <span className="kpi-suffix">({kpis.countAmt} SRs)</span>}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              Total Discount
              <span className="kpi-info-icon" title="Total Discount">ℹ️</span>
            </div>
            <div className="kpi-value">₹{kpis.totalDiscount.toLocaleString(undefined, { maximumFractionDigits: 0 })} {kpis.countDisc>0 && <span className="kpi-suffix">({kpis.countDisc} SRs)</span>}</div>
          </div>
        </div>
        <ErrorBoundary>
          <TransactionsTable loading={loading} data={data} error={error} />
        </ErrorBoundary>
        <div className="pagination-wrapper">
          <PaginationControls page={page} pageSize={10} total={total} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default App;
