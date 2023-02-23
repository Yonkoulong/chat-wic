import axios from "axios";
import { useAppStore } from '@/stores/AppStore';

const baseURL = import.meta.env.VITE_CHAT_WIC_API || "http://localhost:8080";
// const userInfo =  useAppStore((state) => state.userInfo);
const token = localStorage.getItem('token');

export const requestAxios = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token && token}`
  }
});

export default requestAxios;
