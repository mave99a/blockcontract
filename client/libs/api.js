import axios from 'axios';

axios.defaults.baseURL = process.env.apiPrefix || '';
axios.defaults.timeout = 200000;

export default axios;
