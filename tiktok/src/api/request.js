import axios from 'axios';

const ins = axios.create({
  baseURL: process.env.REACT_APP_BASE_PATH,
});

ins.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (!token) return config;

  config.headers['authorization'] = token;
  return config;

}, function (error) {
  return Promise.error(error);
})

export default ins;