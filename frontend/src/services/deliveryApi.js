import API from './api';

export const getAvailableJobs = async () => {
  const response = await API.get('/deliveries/available');
  return response.data;
};

export const acceptDeliveryJob = async (deliveryId) => {
  const response = await API.put(`/deliveries/${deliveryId}/accept`);
  return response.data;
};

export const updateDeliveryStatus = async (deliveryId, status, note = '') => {
  const response = await API.put(`/deliveries/${deliveryId}/status`, { status, note });
  return response.data;
};

export const getMyDeliveries = async () => {
  const response = await API.get('/deliveries/my');
  return response.data;
};
