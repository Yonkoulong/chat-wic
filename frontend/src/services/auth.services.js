import { requestAxios, noTokenAxios } from "./http";

export async function postSignIn(payload) {
  return noTokenAxios.post("/login", payload);
}

export async function postSignUpOrganization(payload) {
  return noTokenAxios.post("/organize/register", payload);
}

export async function getRefreshToken() {
  return requestAxios.post("/user/refresh-token", {});
}