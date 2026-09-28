import api from './api';

const expenseService = {
  create: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },
  getByGroup: async (groupId, params = {}) => {
    const response = await api.get(`/expenses/group/${groupId}`, { params });
    return response.data;
  },
  getSummary: async (groupId) => {
    const response = await api.get(`/expenses/summary/${groupId}`);
    return response.data;
  },
  update: async (expenseId, data) => {
    const response = await api.put(`/expenses/${expenseId}`, data);
    return response.data;
  },
  remove: async (expenseId) => {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },
  calculateSettlements: async (groupId) => {
    const response = await api.post(`/settle/${groupId}`);
    return response.data;
  },
  getSettlementHistory: async (groupId) => {
    const response = await api.get(`/settle/history/${groupId}`);
    return response.data;
  },
  markSettlementPaid: async (settlementId) => {
    const response = await api.put(`/settle/${settlementId}/pay`);
    return response.data;
  }
};

export default expenseService;