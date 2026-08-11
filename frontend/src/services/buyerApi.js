import API from './api';

export const createBuyerRequirement = async (data) => {
  const response = await API.post('/buyer/requirements', data);
  return response.data;
};

export const getMyBuyerRequirements = async () => {
  const response = await API.get('/buyer/requirements/my');
  return response.data;
};

export const getIncomingSaleRequests = async () => {
  const response = await API.get('/buyer/sale-requests');
  return response.data;
};
