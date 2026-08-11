import API from './api';

export const createHarvest = async (harvestData) => {
  const response = await API.post('/harvests', harvestData);
  return response.data;
};

export const getMyHarvests = async () => {
  const response = await API.get('/harvests/my');
  return response.data;
};

export const getAvailableHarvests = async (cropFilter = '') => {
  const url = cropFilter ? `/harvests/available?crop=${encodeURIComponent(cropFilter)}` : '/harvests/available';
  const response = await API.get(url);
  return response.data;
};

export const getHarvestById = async (id) => {
  const response = await API.get(`/harvests/${id}`);
  return response.data;
};
