import { requestAxios } from "./http";

//Channel
export async function postChannel(payload) {
  return requestAxios.post("/channel/create", payload);
}

export async function getChannelsByUser(payload) {
  return requestAxios.post(`/channel/${payload?.userId}/list`);
}

export async function getChannelDetail(payload) {
  return requestAxios.post(`/channel/${payload.channelId}`, {});
}

//Message
export async function getMessageChannelByChannelId(payload) {
  return requestAxios.post(`/message-channel/${payload?.channelId}`, {});
}

export async function postMessageChannel(payload) {
  return requestAxios.post(
    `/message-channel/${payload?.channelId}/create`,
    payload
  );
}

export async function putUpdateMessageChannel(messageId, payload) {
  return requestAxios.put(`/message-channel/${messageId}`, payload);
}

export async function deleteMessageChannel(messageId) {
  return requestAxios.delete(`/message-channel/${messageId}/delete`, { data: {} });
}

export async function postSearchMemberByChannel(channelId, payload) {
  return requestAxios.post(`/channel/${channelId}/users`, payload);
}