import { useMemo } from 'react';
import { ArrowUpRight, CalendarDays, CreditCard, Dumbbell, Users, UserRoundCheck, UserRoundX } from 'lucide-react';
import StatCard from '../components/StatCard';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export default function Dashboard({ summary, members, plans, onNavigate, loading }) {
  const recentMembers = useMemo(() => members.slice(0, 5), [members]);
  const expiringSoon = useMemo(() => members
    .filter(member => {
      const days = Math.ceil((new Date(`${member.expiryDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
    .slice(0, 4), [members]);

  if (loading) return <div className="loading-panel">Getting your gym ready…</div>;

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow light-eyebrow">YOUR GYM AT A GLANCE</span>
          <h2>Small steps. Stronger people.</h2>
          <p>Here’s what’s happening at your gym today.</p>
          <button className="banner-button" onClick={() => onNavigate('members')}>Manage members <ArrowUpRight size={16} /></button>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="art-ring ring-one"></div>
          <div className="art-ring ring-two"></div>
          <Dumbbell size={104} strokeWidth={1.2} />
        </div>
      </section>

      <div className="section-heading stats-heading">
        <div><h2>Overview</h2><p>A quick look at membership and revenue.</p></div>
        <div className="date-chip"><CalendarDays size={16} /> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
      </div>

      <section className="stats-grid">
        <StatCard title="Total members" value={summary.totalMembers ?? members.length} detail="All registered members" icon={Users} tone="blue" />
        <StatCard title="Active memberships" value={summary.activeMembers ?? 0} detail="Memberships in date" icon={UserRoundCheck} tone="green" />
        <StatCard title="Expired memberships" value={summary.expiredMembers ?? 0} detail="Need renewal follow-up" icon={UserRoundX} tone="orange" />
        <StatCard title="Estimated revenue" value={formatCurrency(summary.estimatedMonthlyRevenue)} detail="Active plan value · estimate" icon={CreditCard} tone="purple" />
      </section>

      <section className="dashboard-columns">
        <div className="panel recent-panel">
          <div className="panel-heading">
            <div><h3>Recent members</h3><p>Latest people added to your gym</p></div>
            <button className="text-button" onClick={() => onNavigate('members')}>View all <ArrowUpRight size={15} /></button>
          </div>
          {recentMembers.length ? (
            <div className="recent-list">
              {recentMembers.map(member => (
                <div className="recent-row" key={member.id}>
                  <div className="member-avatar">{member.fullName.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                  <div className="recent-person"><strong>{member.fullName}</strong><span>{member.email}</span></div>
                  <div className="recent-plan">{member.plan?.name || 'No plan'}<span>Joined {member.joinDate}</span></div>
                  <span className={`status-pill ${member.currentStatus === 'EXPIRED' || member.expiryDate < new Date().toISOString().slice(0, 10) ? 'expired' : 'active'}`}>
                    {member.expiryDate < new Date().toISOString().slice(0, 10) ? 'Expired' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          ) : <div className="empty-state"><Users size={28} /><strong>No members yet</strong><span>Add your first member to get started.</span></div>}
        </div>

        <div className="panel side-panel">
          <div className="panel-heading"><div><h3>Renewal reminders</h3><p>Memberships expiring in 7 days</p></div></div>
          {expiringSoon.length ? (
            <div className="reminder-list">
              {expiringSoon.map(member => (
                <div className="reminder-row" key={member.id}>
                  <div className="reminder-icon"><CalendarDays size={17} /></div>
                  <div className="reminder-copy"><strong>{member.fullName}</strong><span>Expires {member.expiryDate}</span></div>
                  <span className="reminder-days">{Math.max(0, Math.ceil((new Date(`${member.expiryDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000))}d</span>
                </div>
              ))}
            </div>
          ) : <div className="empty-state small-empty"><CalendarDays size={25} /><span>No upcoming renewals.</span></div>}
          <div className="plan-summary">
            <div className="plan-summary-title"><span>Membership plans</span><strong>{plans.length}</strong></div>
            <div className="mini-plan-list">
              {plans.slice(0, 3).map(plan => <div key={plan.id}><span>{plan.name}</span><strong>{formatCurrency(plan.price)}</strong></div>)}
            </div>
            <button className="text-button" onClick={() => onNavigate('plans')}>Manage plans <ArrowUpRight size={15} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
