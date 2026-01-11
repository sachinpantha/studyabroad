import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://studyabroad-krny.onrender.com'
  : 'https://studyabroad-krny.onrender.com';

axios.defaults.baseURL = API_BASE_URL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;