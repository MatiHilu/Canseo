import axios from 'axios';

class AuthService {
  static isAuthenticated() {
    const token = localStorage.getItem('Authorization');
    return !!token;
  }

  static setAuthHeader() {
    const token = localStorage.getItem('Authorization');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
    }
  }
}

export default AuthService;
