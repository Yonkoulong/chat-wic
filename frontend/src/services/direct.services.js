import { requestAxios } from "./http";

export async function getDirectsByUserId () {
    return await requestAxios.post('/direct/:userId/list', {});
}