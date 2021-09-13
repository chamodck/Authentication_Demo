import Cookies from 'js-cookie';
export default function authHeader() {

  const token =Cookies.get('token');
  if (token) {
    return { Authorization: 'Bearer ' + token }; 
    
  } else {
    return {};
  }
}
