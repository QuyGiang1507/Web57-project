import axios from 'axios';

const ins = axios.create({
    baseUrl: process.env.REACT_APP_URL,
})

export default ins