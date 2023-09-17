import http from "../http-common";
const login = (data) => {
  return http.post('/auth/login', data);
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href="/login";
};

const isAdmin = () => {
  const roles = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))?.roles;
  return roles && roles?.includes('admin');
}

const getLocalAccessToken = () => {
  return localStorage.getItem('token');
}


export const AuthService = {
  login,
  logout,
  isAdmin,
  getLocalAccessToken
};
