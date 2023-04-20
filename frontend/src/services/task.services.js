import { requestAxios } from "./http";

export async function postCreateTask (payload)  {
    return requestAxios.post('/tasks/create', payload);
}

export async function getTaskDetail (taskId) {
    return requestAxios.post(`/tasks/${taskId}`)
}

export async function putUpdateTask (taskId, payload) {
    return requestAxios.put(`/task/${taskId}/update`, payload)
}

export async function getTaskByOrganize (organizeId) {
    return requestAxios.post(`/tasks/${organizeId}`, payload)
}