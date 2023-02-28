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