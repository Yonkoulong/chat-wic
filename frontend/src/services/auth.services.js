import { requestAxios, noTokenAxios } from "./http";

export async function postSignIn(payload) {
  return noTokenAxios.post("/login", payload);
}

export async function postSignUpOrganization(payload) {
  return requestAxios.post("/organize/register", payload);
}

export async function getRefreshToken() {
  return requestAxios.get("/user/refresh-token");
}