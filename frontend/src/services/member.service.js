import { requestAxios } from "./http";


export async function createMember(payload) {
    return requestAxios.post("/user/create", payload);
}

export async function getMembersByOrganizeId(payload) {
    return requestAxios.post("/users", payload)
}

export async function getMemberDetail(id) {
    return requestAxios.get(`/user/${id}`);
}

export async function putUserDetail(payload) {
    return requestAxios.put(`/user/${payload?.id}/update-profile`, payload);
}

export async function getResetPasswordByUserId(id) {
    return requestAxios.get(`/user/${id}/reset-password`);
}

export async function deleteUserByUserIds(payload) {
    return requestAxios.delete("/user/delete", { data: payload });
}