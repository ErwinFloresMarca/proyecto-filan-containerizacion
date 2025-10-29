import axios from 'axios';

const taskApi = axios.create({
  baseURL: import.meta.env.VITE_TASK_SERVICE_URL || 'http://192.168.122.53:3001',
});

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL || 'http://192.168.122.54:3002',
});

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

// Task API
export const getTasks = () => taskApi.get<Task[]>('/tasks');
export const getTask = (id: string) => taskApi.get<Task>(`/tasks/${id}`);
export const createTask = (data: Partial<Task>) => taskApi.post<Task>('/tasks', data);
export const updateTask = (id: string, data: Partial<Task>) => taskApi.patch<Task>(`/tasks/${id}`, data);
export const deleteTask = (id: string) => taskApi.delete(`/tasks/${id}`);
export const getTaskStats = () => taskApi.get<TaskStats>('/tasks/stats');

// User API
export const getUsers = () => userApi.get<User[]>('/users');
export const getUser = (id: string) => userApi.get<User>(`/users/${id}`);
export const createUser = (data: Partial<User>) => userApi.post<User>('/users', data);
export const updateUser = (id: string, data: Partial<User>) => userApi.patch<User>(`/users/${id}`, data);
export const deleteUser = (id: string) => userApi.delete(`/users/${id}`);
export const getUserStats = () => userApi.get<UserStats>('/users/stats');
