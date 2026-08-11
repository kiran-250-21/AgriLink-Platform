import API from './api';

export const getAllUsers = async (roleFilter = '', statusFilter = '') => {
  let url = '/admin/users?';
  if (roleFilter) url += `role=${roleFilter}&`;
  if (statusFilter) url += `status=${statusFilter}&`;
  const response = await API.get(url);
  return response.data;
};

export const updateUserStatus = async (userId, status, verificationStatus) => {
  const response = await API.put(`/admin/users/${userId}/status`, { status, verificationStatus });
  return response.data;
};

export const getPlatformAnalytics = async () => {
  const response = await API.get('/admin/analytics');
  return response.data;
};

export const getAuditLogs = async () => {
  const response = await API.get('/admin/audit-logs');
  return response.data;
};

export const getMarkets = async () => {
  const response = await API.get('/markets');
  return response.data;
};

export const createMarket = async (marketData) => {
  const response = await API.post('/markets', marketData);
  return response.data;
};

export const getMarketPrices = async (crop = '') => {
  const url = crop ? `/markets/prices?crop=${encodeURIComponent(crop)}` : '/markets/prices';
  const response = await API.get(url);
  return response.data;
};

export const updateMarketPrice = async (priceData) => {
  const response = await API.post('/markets/prices', priceData);
  return response.data;
};
