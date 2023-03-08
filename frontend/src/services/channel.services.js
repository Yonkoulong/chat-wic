import { requestAxios } from "./http";

export async function getChannelsByUser(payload) {
  return requestAxios.post(`/channel/${payload?.userId}/list`);
}

export async function getChannelDetail(payload) {
  return requestAxios.post(`/channel/${payload.channelId}`, {});
}

export async function getMessageChannelByChannelId(payload) {
  return requestAxios.post(`/message-channel/${payload?.channelId}`, {})
}

export async function postMessageChannel(payload) {
  return requestAxios.post(`/message-channel/${payload?.channelId}/create`, payload);
}

