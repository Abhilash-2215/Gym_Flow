const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || Object.values(body).find(value => typeof value === 'string') || message;
    } catch {
      // Some responses have no JSON body.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const gymApi = {
  getDashboard: () => request('/dashboard'),
  getMembers: () => request('/members'),
  createMember: member => request('/members', { method: 'POST', body: JSON.stringify(member) }),
  updateMember: (id, member) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(member) }),
  deleteMember: id => request(`/members/${id}`, { method: 'DELETE' }),
  getPlans: () => request('/plans'),
  createPlan: plan => request('/plans', { method: 'POST', body: JSON.stringify(plan) }),
  updatePlan: (id, plan) => request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(plan) }),
  deletePlan: id => request(`/plans/${id}`, { method: 'DELETE' })
};
