import axios from 'axios';

const setAuthToken = (token, init = false) => {
  if (token) {
    if (init) localStorage.setItem('Authorization', token);
    axios.defaults.headers.common.Authorization = token;
  }
  else {
    localStorage.removeItem('Authorization');    
    delete axios.defaults.headers.common.Authorization;    
  }
}

export default setAuthToken;