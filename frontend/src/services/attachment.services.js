import { requestAxios } from "./http";
import axios from "axios";


export async function uploadFile(action, formdata) {
    return await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, formdata);
}
