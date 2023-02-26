import axios from "axios";
import { useAppStore } from '@/stores/AppStore';
import { redirectTo } from "../shared/utils/history";
import { toast } from "react-toastify";


const baseURL = import.meta.env.VITE_CHAT_WIC_API || "http://localhost:8080";

export const requestAxios = axios.create({
  baseURL
});

export const noTokenAxios = axios.create({
  baseURL
});

// Add a request interceptor
requestAxios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error(`Authorization Fail!`);
    return redirectTo('/signin');
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token && token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
requestAxios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  return response;
}, function (error) {

  if (error?.response?.status == 401) {
    redirectTo("/signin");
    toast.error(`Authorization Fail!`);
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});





export default requestAxios;
