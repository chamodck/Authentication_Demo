import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_KEY;


class UserService {

  getUserProfile() {
    return axios.get(API_URL + '/UserProfile', { headers: authHeader() });
  }

}

export default new UserService();
