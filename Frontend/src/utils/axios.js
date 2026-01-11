import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://studyabroad-krny.onrender.com'
  : 'http://localhost:5000';

axios.defaults.baseURL = API_BASE_URL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;