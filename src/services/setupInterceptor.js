import axiosInstance from "../http-common";
import {AuthService} from "./AuthService";
const setup = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = AuthService.getLocalAccessToken();
      if (token) {
        // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use((res) => {
    return Promise.resolve(res);
    }, (error) => {
        console.log(error);
        if (error!= null && [401, 403].includes(error.response?.status)) {
            AuthService.logout();
            window.location.href='/login';
        }
        return Promise.reject(error);
    })

};
export default setup;