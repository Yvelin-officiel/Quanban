import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
