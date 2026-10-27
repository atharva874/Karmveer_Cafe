import axios from 'axios';
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const apiBaseUrl = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/api$/i, '')}/api`
  : '/api';
const api = axios.create({baseURL: apiBaseUrl, withCredentials:true});
export default api;
