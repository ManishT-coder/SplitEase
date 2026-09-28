import api from './api';

const groupService = {
  getAll: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/groups', data);
    return response.data;
  },
  getById: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    // The API returns { success, group, expenses, balances } — flatten it so
    // consumers can use group.name, group.members, group.expenses, etc.
    // directly.
    const data = response.data;
    return {
      ...data.group,
      expenses: data.expenses || [],
      balances: data.balances || {}
    };
  },
  update: async (groupId, data) => {
    const response = await api.put(`/groups/${groupId}`, data);
    return response.data;
  },
  remove: async (groupId) => {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },
  addMember: async (groupId, email) => {
    const response = await api.post(`/groups/${groupId}/members`, { email });
    return response.data;
  },
  removeMember: async (groupId, userId) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },
  leave: async (groupId) => {
    const response = await api.post(`/groups/${groupId}/leave`);
    return response.data;
  }
};

export default groupService;