import axios from 'axios';

const http = (token) => {
  const headers = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return axios.create({
    headers,
    baseURL: process.env.REACT_APP_BACKEND_URL,
  });
};

export default http;
