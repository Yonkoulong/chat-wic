import { requestAxios } from "./http";

export async function getChannelsByUser(payload) {
  return requestAxios.post(`/channel/${payload?.userId}/list`);
}