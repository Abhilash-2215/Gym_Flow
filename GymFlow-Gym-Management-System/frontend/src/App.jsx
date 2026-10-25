import { useCallback, useEffect, useState } from 'react';
import { Bell, Search, RefreshCw, Menu, X, Dumbbell, AlertCircle, CheckCircle2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Plans from './pages/Plans';
import { gymApi } from './api/gymApi';

const pageTitles = {
  dashboard: 'Dashboard',
  members: 'Members',
  plans: 'Membership plans'
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [summary, setSummary] = useState({});
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const refreshData = useCallback(async () => {
    setLoadError('');
    try {
      const [dashboardData, memberData, planData] = await Promise.all([
        gymApi.getDashboard(),
        gymApi.getMembers(),
        gymApi.getPlans()
      ]);
      setSummary(dashboardData);
      setMembers(memberData);
      setPlans(planData);
    } catch (error) {
      setLoadError(error.message || 'Could not connect to the backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const notify = (message, type = 'success') => setNotice({ message, type });

  function navigate(page) {
    setActivePage(page);
    setMobileNavOpen(false);
    setGlobalSearch('');
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}
      <div className={`sidebar-wrap ${mobileNavOpen ? 'mobile-open' : ''}`}>
        <Sidebar activePage={activePage} onNavigate={navigate} />
        <button className="mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={20} /></button>
      </div>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{pageTitles[activePage]}</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={17} /><input value={globalSearch} onChange={event => { setGlobalSearch(event.target.value); if (event.target.value) setActivePage('members'); }} placeholder="Find a member…" /><kbd>⌘ K</kbd></label>
            <button className="top-icon-button" onClick={refreshData} aria-label="Refresh data"><RefreshCw size={18} /></button>
            <button className="top-icon-button notification-button" onClick={() => navigate('members')} aria-label="View member reminders"><Bell size={18} /><span></span></button>
            <div className="topbar-avatar">GA</div>
          </div>
        </header>

        {loadError && (
          <div className="connection-alert">
            <AlertCircle size={19} />
            <div><strong>Backend connection needed</strong><span>{loadError}. Start Spring Boot and check your MySQL settings.</span></div>
            <button className="button secondary" onClick={refreshData}>Try again</button>
          </div>
        )}

        {activePage === 'dashboard' && <Dashboard summary={summary} members={members} plans={plans} onNavigate={navigate} loading={loading && !loadError} />}
        {activePage === 'members' && <Members members={globalSearch ? members.filter(member => `${member.fullName} ${member.email} ${member.phone}`.toLowerCase().includes(globalSearch.toLowerCase())) : members} plans={plans} onRefresh={refreshData} notify={notify} />}
        {activePage === 'plans' && <Plans plans={plans} members={members} onRefresh={refreshData} notify={notify} />}

        <footer className="app-footer"><span><Dumbbell size={14} /> GymFlow</span><span>Made for a healthier community · {new Date().getFullYear()}</span></footer>
      </main>

      {notice && <div className={`toast ${notice.type}`} role="status">{notice.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}{notice.message}</div>}
    </div>
  );
}
