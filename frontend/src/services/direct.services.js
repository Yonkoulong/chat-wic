import { requestAxios } from "./http";

//Direct
export async function postCreateDirect (payload) {
    return await requestAxios.post("/direct/create", payload);
}

export async function getDirectsByUserId (userId, payload) {
    return await requestAxios.post(`/direct/${userId}/list`, payload);
}

export async function getDirectDetail(directId, payload) {
    return requestAxios.post(`/direct/${directId}`, payload);
}

export async function postCheckAlreadyExistDirect(payload) {
    return requestAxios.post("direct/check-already-exist-direct", payload);
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