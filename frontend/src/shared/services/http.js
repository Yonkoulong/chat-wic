import axios from 'axios';

const BASE_URL = process.env?.CHAT_WIC_API;

export const http = axios.create({
    baseURL: BASE_URL
});