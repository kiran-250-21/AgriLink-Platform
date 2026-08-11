import API from './api';

export const analyzeRecommendation = async (harvestId, quantity) => {
  const response = await API.post('/recommendations/analyze', { harvestId, quantity });
  return response.data;
};
