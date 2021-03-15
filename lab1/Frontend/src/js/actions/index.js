import { USER_LOGIN, USER_LOGOUT} from "../constants/action-types";
export function loginAction(payload) {
  console.log("dispatching the login action : " + payload.username + " : " + payload.password);
  return { type: USER_LOGIN, payload };
}

export function logoutAction() {
  console.log("dispatching the logout action")
  return { type: USER_LOGOUT };
}
