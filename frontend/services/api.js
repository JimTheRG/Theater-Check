import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// We set this to localhost for Web and a static IP placeholder for Mobile.
// For Web (localhost:19006), the backend must also be accessed via localhost:3000 to avoid CORS issues.
const API_URL = Platform.OS === 'web' ? 'http://localhost:3000/api' : 'http://192.168.1.36:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  let token;
  if (Platform.OS === 'web') {
    token = localStorage.getItem('userToken');
  } else {
    try {
        token = await SecureStore.getItemAsync('userToken');
    } catch (e) {
        console.log("SecureStore not available");
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
