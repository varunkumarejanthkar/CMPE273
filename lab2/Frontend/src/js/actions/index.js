import { USER_LOGIN, USER_LOGOUT, USER_GROUPS} from "../constants/action-types";
export function loginAction(payload) {
  console.log("dispatching the login action : " + payload.UserName + " : " + payload.Password);
  return { type: USER_LOGIN, payload };
}

export function groupsAction(payload) {
  //console.log("dispatching the groups action : " + payload.UserName + " : " + payload.Password);
  return { type: USER_GROUPS, payload };
}

export function logoutAction() {
  console.log("dispatching the logout action")
  return { type: USER_LOGOUT };
}
