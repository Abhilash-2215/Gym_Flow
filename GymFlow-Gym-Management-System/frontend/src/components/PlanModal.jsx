import { useState } from 'react';
import { X } from 'lucide-react';

export default function PlanModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price ?? '',
    durationDays: plan?.durationDays ?? 30
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, price: Number(form.price), durationDays: Number(form.durationDays) });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="modal-card compact-modal" role="dialog" aria-modal="true" aria-labelledby="plan-modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MEMBERSHIP SETUP</span>
            <h2 id="plan-modal-title">{plan ? 'Edit plan' : 'Create membership plan'}</h2>
            <p>Set a clear price and membership duration.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field full-width">Plan name
            <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Monthly" required maxLength="60" />
          </label>
          <label className="field full-width">Description
            <textarea name="description" value={form.description} onChange={updateField} placeholder="What does this plan include?" required maxLength="250" rows="3" />
          </label>
          <label className="field">Price (₹)
            <input type="number" name="price" value={form.price} onChange={updateField} min="1" step="0.01" required />
          </label>
          <label className="field">Duration (days)
            <input type="number" name="durationDays" value={form.durationDays} onChange={updateField} min="1" required />
          </label>
          {error && <div className="form-error full-width">{error}</div>}
          <div className="modal-actions full-width">
            <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button primary" disabled={saving}>{saving ? 'Saving…' : 'Save plan'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
