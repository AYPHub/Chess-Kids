import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const puzzleAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.completed !== undefined) params.append('completed', filters.completed);
    
    const response = await apiClient.get(`/puzzles?${params.toString()}`);
    return response.data.puzzles;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/puzzles/${id}`);
    return response.data;
  },

  markComplete: async (id, attemptData) => {
    const response = await apiClient.post(`/puzzles/${id}/complete`, attemptData);
    return response.data;
  }
};

export const progressAPI = {
  get: async () => {
    const response = await apiClient.get('/progress');
    return response.data;
  },

  awardAchievement: async (achievementId) => {
    const response = await apiClient.post('/progress/achievement', { 
      achievement_id: achievementId 
    });
    return response.data;
  }
};

export const gameAPI = {
  save: async (gameState) => {
    const response = await apiClient.post('/game/save', gameState);
    return response.data;
  },

  load: async (puzzleId) => {
    try {
      const response = await apiClient.get(`/game/${puzzleId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No saved state
      }
      throw error;
    }
  }
};

export const healthAPI = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

// Export default for easy import
export default {
  puzzle: puzzleAPI,
  progress: progressAPI,
  game: gameAPI,
  health: healthAPI
};