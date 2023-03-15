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
  // define payload : { content, messageFrom - id sender, type, replyId || null}
  return requestAxios.post(
    `/message-channel/${payload?.channelId}/create`,
    payload
  );
}
