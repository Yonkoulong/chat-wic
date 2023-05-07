import { requestAxios } from "./http";


export async function getMessagesThread (threadId) {
    return requestAxios.get(`/message-thread/${threadId}`);
}

export async function postMessageThread (messageChannelId, payload)  {
    return requestAxios.post(`/message-thread/${messageChannelId}/create`, payload);
}

export async function editMessageThread () {

}

export async function deleteMessageThread (messageThreadId) {
    return requestAxios.delete(`/message-thread/${messageThreadId}/delete`);
}
