import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configure axios to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const errorData = error.response.data as { error?: string; message?: string };
      throw new Error(errorData.message || errorData.error || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to reach the server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const boardService = {
  async getAll() {
    const response = await axios.get(`${API_URL}/boards`);
    return response.data;
  },

  async getById(id: number) {
    const response = await axios.get(`${API_URL}/boards/${id}`);
    return response.data;
  },

  async getWithDetails(id: number) {
    const response = await axios.get(`${API_URL}/boards/${id}/details`);
    return response.data;
  },

  async create(data: { title: string; description?: string }) {
    const response = await axios.post(`${API_URL}/boards`, data);
    return response.data;
  },

  async update(id: number, data: { title: string; description?: string }) {
    const response = await axios.put(`${API_URL}/boards/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    await axios.delete(`${API_URL}/boards/${id}`);
  }
};

export const columnService = {
  async getByBoardId(boardId: number) {
    const response = await axios.get(`${API_URL}/columns/board/${boardId}`);
    return response.data;
  },

  async create(data: { board_id: number; title: string; position: number }) {
    const response = await axios.post(`${API_URL}/columns`, data);
    return response.data;
  },

  async update(id: number, data: { title: string; position: number }) {
    const response = await axios.put(`${API_URL}/columns/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    await axios.delete(`${API_URL}/columns/${id}`);
  }
};

export const taskService = {
  async getByColumnId(columnId: number) {
    const response = await axios.get(`${API_URL}/tasks/column/${columnId}`);
    return response.data;
  },

  async create(data: {
    column_id: number;
    title: string;
    description?: string;
    position: number;
    priority?: string;
    due_date?: string;
  }) {
    const response = await axios.post(`${API_URL}/tasks`, data);
    return response.data;
  },

  async update(id: number, data: {
    column_id: number;
    title: string;
    description?: string;
    position: number;
    priority?: string;
    due_date?: string;
  }) {
    const response = await axios.put(`${API_URL}/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    await axios.delete(`${API_URL}/tasks/${id}`);
  }
};
