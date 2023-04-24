import { requestAxios } from "./http";

export async function postCreateTask (payload)  {
    return requestAxios.post('/tasks/create', payload);
}

export async function getTaskDetail (taskId) {
    return requestAxios.post(`/task/${taskId}`)
}

export async function putUpdateTask (taskId, payload) {
    return requestAxios.put(`/task/${taskId}/update`, payload)
}

export async function getTasksByChannelId (channelId, payload) {
    return requestAxios.post(`/tasks/${channelId}/list`, payload)
}