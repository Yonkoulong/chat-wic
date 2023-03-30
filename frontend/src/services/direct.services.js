import { requestAxios } from "./http";

export async function postCreateDirect (payload) {
    return await requestAxios.post("/direct/create", payload);
}

export async function getDirectsByUserId (payload) {
    return await requestAxios.post(`/direct/${payload?.userId}/list`, payload);
}