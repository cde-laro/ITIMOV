const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
import axios from 'axios';

export async function fetchWithAuth(url: string, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    window.location.href = '/logout';
  }

  return response;
}

export async function register({ username, email, password }: { username: string; email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    if (!response.data.token) {
      throw new Error('Token missing in the response');
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error during registration:", error.response?.data || error.message);
      throw new Error(error.response?.data || error.message);
    } else {
      console.error("Unexpected error during registration:", error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function login({ username, password }: { username: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    if (!response.data.token) {
      throw new Error('Token missing in the response');
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error during login:", error.response?.data || error.message);
      throw new Error(error.response?.data || error.message);
    } else {
      console.error("Unexpected error during login:", error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function fetchMovies() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found in localStorage');
  }

  try {
    const response = await axios.get(`${API_URL}/movies`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure token is sent in the correct format
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching movies:", error.response?.data || error.message);
      throw new Error(error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching movies:", error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function toggleMovieStatus(movieId: string, statusType: 'watched' | 'liked') {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found in localStorage');
  }

  try {
    const response = await axios.post(`${API_URL}/users/me/movies/${movieId}/${statusType}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error toggling movie ${statusType} status:`, error.response?.data || error.message);
      throw new Error(error.response?.data || error.message);
    } else {
      console.error(`Unexpected error toggling movie ${statusType} status:`, error);
      throw new Error('An unexpected error occurred');
    }
  }
}