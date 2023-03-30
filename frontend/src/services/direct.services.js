import { requestAxios } from "./http";

//Direct
export async function postCreateDirect (payload) {
    return await requestAxios.post("/direct/create", payload);
}

export async function getDirectsByUserId (payload) {
    return await requestAxios.post(`/direct/${payload?._id}/list`, { organizeId: payload?.organizeId });
}

export async function getDirectDetail(payload) {
    return requestAxios.post(`/direct/${payload.directId}`, {});
}


//Message
export async function postMessageDirect(directId, payload) {
    return await requestAxios.post(`/message-direct/${directId}/create`, payload);
}

export async function getMessageByDirectId(payload) {
    return await requestAxios.post(`/message-direct/${payload?.directId}/messages`, {});
}

export async function putMessageDirect(idMessageEdit, payload) {
    return await requestAxios.put(`/message-direct/${idMessageEdit}/update-message`, payload);
}

export async function deleteMessageDirect(messageId) {
    return requestAxios.delete(`/message-direct/${messageId}/delete`, { data: {} });
}