import { useState } from 'react';
import { Plus, Pencil, Trash2, CalendarDays, CheckCircle2 } from 'lucide-react';
import PlanModal from '../components/PlanModal';
import { gymApi } from '../api/gymApi';

const currency = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function Plans({ plans, members, onRefresh, notify }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  async function savePlan(payload) {
    if (selectedPlan) await gymApi.updatePlan(selectedPlan.id, payload);
    else await gymApi.createPlan(payload);
    await onRefresh();
    setModalOpen(false);
    notify(selectedPlan ? 'Membership plan updated.' : 'Membership plan created.');
  }

  async function deletePlan(plan) {
    const inUse = members.some(member => member.plan?.id === plan.id);
    if (inUse) {
      notify('This plan is assigned to a member. Reassign those members before deleting it.', 'error');
      return;
    }
    if (!window.confirm(`Delete the ${plan.name} plan?`)) return;
    try {
      await gymApi.deletePlan(plan.id);
      await onRefresh();
      notify('Membership plan deleted.');
    } catch (error) {
      notify(error.message, 'error');
    }
  }

  return (
    <div className="page-content">
      <div className="section-heading page-title-row">
        <div><span className="eyebrow">MEMBERSHIP OPTIONS</span><h2>Plans & pricing</h2><p>Set up flexible plans for different training goals.</p></div>
        <button className="button primary" onClick={() => { setSelectedPlan(null); setModalOpen(true); }}><Plus size={17} /> Create plan</button>
      </div>

      <div className="plans-intro panel">
        <div className="plans-intro-icon"><CalendarDays size={23} /></div>
        <div><strong>Simple plans, clear pricing</strong><p>Members can be assigned a plan when their profile is created. You can update pricing and duration here.</p></div>
        <span className="plan-count">{plans.length} plans</span>
      </div>

      <div className="plans-grid">
        {plans.map((plan, index) => {
          const enrolled = members.filter(member => member.plan?.id === plan.id).length;
          return (
            <article className={`plan-card plan-color-${index % 3}`} key={plan.id}>
              <div className="plan-card-top"><div className="plan-symbol"><CheckCircle2 size={21} /></div><span className="plan-duration">{plan.durationDays} days</span></div>
              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-price">{currency(plan.price)}<span> / plan</span></div>
              <div className="plan-card-divider"></div>
              <div className="plan-card-detail"><span>Members on this plan</span><strong>{enrolled}</strong></div>
              <div className="plan-card-detail"><span>Duration</span><strong>{plan.durationDays} days</strong></div>
              <div className="plan-card-actions">
                <button className="button secondary" onClick={() => { setSelectedPlan(plan); setModalOpen(true); }}><Pencil size={15} /> Edit</button>
                <button className="button icon-only-button" onClick={() => deletePlan(plan)} aria-label={`Delete ${plan.name}`}><Trash2 size={16} /></button>
              </div>
            </article>
          );
        })}
      </div>
      {!plans.length && <div className="panel empty-state plans-empty"><CalendarDays size={30} /><strong>No plans yet</strong><span>Create a membership plan to get started.</span></div>}
      {modalOpen && <PlanModal plan={selectedPlan} onClose={() => setModalOpen(false)} onSave={savePlan} />}
    </div>
  );
}
