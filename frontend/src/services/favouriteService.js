import axios from 'axios';

const API_URL = 'http://localhost:8080/api/favorites';

// Get all favorites for the current user
export const getFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Add a tool to favorites
export const addFavorite = async (toolName) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    console.log(token)
    const response = await axios.post(API_URL, { toolName }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// Remove a tool from favorites
export const removeFavorite = async (toolName) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const encodedToolName = encodeURIComponent(toolName);
    const response = await axios.delete(`${API_URL}/${encodedToolName}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};