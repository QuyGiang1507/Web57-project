import axios from 'axios';

const ins = axios.create({
  baseURL: 'https://upload-video-backend.herokuapp.com/',
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