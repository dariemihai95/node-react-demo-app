import { instance } from "./axiosService";
import { AxiosRequestConfig } from 'axios';
import { getAuthToken } from "../utils/authManager";

instance.interceptors.request.use(
  (request: AxiosRequestConfig) => {
    if (request.url?.includes('task')) {
      const jwt = getAuthToken();
      request.headers = { "Authorization": `Bearer ${jwt}` || '' };
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  });