import { Activity, Dumbbell, LayoutDashboard, Users, CreditCard, HeartPulse } from 'lucide-react';

const navigation = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'plans', label: 'Membership plans', icon: CreditCard }
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Dumbbell size={23} /></div>
        <div>
          <strong>gymflow</strong>
          <span>MANAGEMENT</span>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>
      <nav className="nav-list">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            className={`nav-item ${activePage === id ? 'selected' : ''}`}
            key={id}
            onClick={() => onNavigate(id)}
          >
            <Icon size={19} strokeWidth={1.9} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-promo">
          <div className="promo-icon"><HeartPulse size={20} /></div>
          <strong>Build better habits.</strong>
          <p>Good coaching. Strong community. Better results.</p>
        </div>
        <div className="admin-profile">
          <div className="avatar">AD</div>
          <div className="admin-details">
            <strong>Gym Admin</strong>
            <span>Administrator</span>
          </div>
          <Activity size={17} className="profile-status" />
        </div>
      </div>
    </aside>
  );
}
