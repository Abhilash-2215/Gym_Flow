import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

export default function MemberModal({ member, plans, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    joinDate: today,
    expiryDate: '',
    planId: plans[0]?.id ? String(plans[0].id) : ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setForm({
        fullName: member.fullName || '',
        email: member.email || '',
        phone: member.phone || '',
        joinDate: member.joinDate || today,
        expiryDate: member.expiryDate || '',
        planId: member.plan?.id ? String(member.plan.id) : ''
      });
    } else if (plans.length) {
      const firstPlan = plans[0];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (firstPlan.durationDays || 30));
      setForm(current => ({ ...current, expiryDate: expiry.toISOString().slice(0, 10), planId: String(firstPlan.id) }));
    }
  }, [member, plans]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    if (name === 'planId' && !member) {
      const selectedPlan = plans.find(plan => String(plan.id) === value);
      if (selectedPlan) {
        const expiry = new Date(form.joinDate || today);
        expiry.setDate(expiry.getDate() + selectedPlan.durationDays);
        setForm(current => ({ ...current, planId: value, expiryDate: expiry.toISOString().slice(0, 10) }));
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, planId: Number(form.planId) });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="member-modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MEMBER RECORD</span>
            <h2 id="member-modal-title">{member ? 'Edit member' : 'Add a new member'}</h2>
            <p>Keep member details and membership dates up to date.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field full-width">
            Full name
            <input name="fullName" value={form.fullName} onChange={updateField} placeholder="e.g. Arjun Kumar" required maxLength="100" />
          </label>
          <label className="field">
            Email address
            <input type="email" name="email" value={form.email} onChange={updateField} placeholder="name@example.com" required />
          </label>
          <label className="field">
            Phone number
            <input name="phone" value={form.phone} onChange={updateField} placeholder="Mobile number" required minLength="7" maxLength="20" />
          </label>
          <label className="field">
            Membership plan
            <select name="planId" value={form.planId} onChange={updateField} required>
              <option value="">Choose a plan</option>
              {plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name} · ₹{Number(plan.price).toLocaleString('en-IN')}</option>)}
            </select>
          </label>
          <label className="field">
            Join date
            <input type="date" name="joinDate" value={form.joinDate} onChange={updateField} required />
          </label>
          <label className="field full-width">
            Membership expiry
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={updateField} min={form.joinDate} required />
          </label>
          {error && <div className="form-error full-width">{error}</div>}
          <div className="modal-actions full-width">
            <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button primary" disabled={saving || !plans.length}>
              {saving ? 'Saving…' : member ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
