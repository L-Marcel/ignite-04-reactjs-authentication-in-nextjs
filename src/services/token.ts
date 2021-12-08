import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "./api";
import { getAuthChannel } from "./broadcast/authCannel";
import { AuthTokenError } from "./errors/AuthTokenError";

function saveAuthToken(context = undefined, token: string, refreshToken: string) {
  setCookie(context, "nextauth.token", token, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
  setCookie(context, "nextauth.refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
  api.defaults.headers["Authorization"] = `Bearer ${token}`;

  getAuthChannel().postMessage("signIn");
};

function loadAuthToken(context = undefined, callback: (user: User) => void) {
  const { "nextauth.token": token } = parseCookies(context);
  
  if(token) {
    api.get("/me").then(res => {
      callback(res.data);
    });
  };
};

function deleteAuthToken(context = undefined, broadcast = true) {
  destroyCookie(context, "nextauth.token");
  destroyCookie(context, "nextauth.refreshToken");

  if(broadcast) {
    getAuthChannel().postMessage("signOut");
  };
  
  if(process.browser) {
    Router.push("/");
  } else {
    return Promise.reject(new AuthTokenError());
  };
};

export { saveAuthToken, loadAuthToken, deleteAuthToken };