import api from './api';

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data.user;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get('/users/search', {
      params: { query }
    });
    return response.data.users;
  }
};

export default userService;