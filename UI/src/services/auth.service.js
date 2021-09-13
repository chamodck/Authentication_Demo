import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_KEY;


class AuthService {
  login(loginData) {
    debugger;
    return axios
      .post(API_URL + "/ApplicationUser/Login", loginData)
      .then(response => {
        debugger;
        if (response.data.token) {
          Cookies.set("token",response.data.token);
        }

        return response.data;
      });
  }

  logout() {
    Cookies.remove("token");
  }

  register(userData) {
    debugger;
    return axios.post(API_URL + "/ApplicationUser/Register", userData);
  }

  isLoggedIn() {
    const usertoken =Cookies.get("token");
      if (usertoken) {
        return true;
      }else{
        return false;
      }
  }
}

export default new AuthService();
