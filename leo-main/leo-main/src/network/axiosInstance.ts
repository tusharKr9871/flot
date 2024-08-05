import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token =
    typeof window !== 'undefined' ? window.localStorage.getItem('token') : '';
  const clientId =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('clientId')
      : '';
  config.headers['auth-token'] = token ? token : '';
  config.headers['client-id'] = clientId ? clientId : '';
  return config;
});
