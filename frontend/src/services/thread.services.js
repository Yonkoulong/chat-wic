import { requestAxios } from "./http";


export async function getThreadsInChannel (id, payload)  {
    return requestAxios.post(`/message-thread/${id}/create`, payload);
}

export async function getMessagesThread (threadId) {
    return requestAxios.post(`/message-thread/${threadId}`);
}

export async function postMessageThread (id, payload)  {
    return requestAxios.post(`/message-thread/${id}/create`, payload);
}

export async function editMessageThread () {

}

export async function deleteMessageThread () {

}
