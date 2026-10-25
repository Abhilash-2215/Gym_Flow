import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Users, SlidersHorizontal } from 'lucide-react';
import MemberModal from '../components/MemberModal';

export default function Members({ members, plans, onRefresh, notify }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalMember, setModalMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const filteredMembers = useMemo(() => members.filter(member => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || [member.fullName, member.email, member.phone, member.plan?.name]
      .some(value => String(value || '').toLowerCase().includes(query));
    const isExpired = member.expiryDate < new Date().toISOString().slice(0, 10);
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'EXPIRED' ? isExpired : !isExpired);
    return matchesSearch && matchesStatus;
  }), [members, search, statusFilter]);

  async function saveMember(payload) {
    setBusy(true);
    try {
      const body = {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        joinDate: payload.joinDate,
        expiryDate: payload.expiryDate,
        planId: payload.planId
      };
      const response = modalMember
        ? await (await import('../api/gymApi')).gymApi.updateMember(modalMember.id, body)
        : await (await import('../api/gymApi')).gymApi.createMember(body);
      await onRefresh();
      setModalOpen(false);
      notify(modalMember ? 'Member details updated.' : 'New member added.');
      return response;
    } finally {
      setBusy(false);
    }
  }

  async function deleteMember(member) {
    if (!window.confirm(`Remove ${member.fullName} from the member list?`)) return;
    try {
      const { gymApi } = await import('../api/gymApi');
      await gymApi.deleteMember(member.id);
      await onRefresh();
      notify('Member removed.');
    } catch (error) {
      notify(error.message, 'error');
    }
  }

  return (
    <div className="page-content">
      <div className="section-heading page-title-row">
        <div><span className="eyebrow">GYM DIRECTORY</span><h2>Members</h2><p>Manage member details, plans, and renewal dates.</p></div>
        <button className="button primary" onClick={() => { setModalMember(null); setModalOpen(true); }} disabled={!plans.length}><Plus size={17} /> Add member</button>
      </div>

      <div className="toolbar panel">
        <div className="search-box"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, email, phone or plan…" /></div>
        <div className="filter-control"><SlidersHorizontal size={16} /><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter membership status"><option value="ALL">All members</option><option value="ACTIVE">Active</option><option value="EXPIRED">Expired</option></select></div>
        <span className="result-count">{filteredMembers.length} members</span>
      </div>

      <div className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Member</th><th>Contact</th><th>Plan</th><th>Joined</th><th>Expires</th><th>Status</th><th className="actions-heading">Actions</th></tr></thead>
            <tbody>
              {filteredMembers.map(member => {
                const expired = member.expiryDate < new Date().toISOString().slice(0, 10);
                return (
                  <tr key={member.id}>
                    <td><div className="table-person"><div className="member-avatar">{member.fullName.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div><strong>{member.fullName}</strong></div></td>
                    <td><div className="contact-cell"><span>{member.email}</span><small>{member.phone}</small></div></td>
                    <td><span className="plan-tag">{member.plan?.name || '—'}</span></td>
                    <td>{member.joinDate}</td>
                    <td>{member.expiryDate}</td>
                    <td><span className={`status-pill ${expired ? 'expired' : 'active'}`}><span className="status-dot"></span>{expired ? 'Expired' : 'Active'}</span></td>
                    <td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${member.fullName}`} onClick={() => { setModalMember(member); setModalOpen(true); }}><Pencil size={16} /></button><button className="icon-button danger-icon" aria-label={`Delete ${member.fullName}`} onClick={() => deleteMember(member)}><Trash2 size={16} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filteredMembers.length && <div className="empty-state table-empty"><Users size={30} /><strong>No matching members</strong><span>Try another search or add a member.</span></div>}
        </div>
      </div>
      {!plans.length && <p className="inline-note">Create a membership plan before adding a member.</p>}
      {modalOpen && <MemberModal member={modalMember} plans={plans} onClose={() => setModalOpen(false)} onSave={saveMember} />}
    </div>
  );
}
