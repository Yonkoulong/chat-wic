import { requestAxios } from "./http";

export async function postSignIn(payload) {
  return requestAxios.post("/login", payload);
}

export async function postSignUp(payload) {
  return requestAxios.post("/organize/register", payload);
}
