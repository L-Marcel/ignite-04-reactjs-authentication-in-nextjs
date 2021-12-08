import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { deleteAuthToken, saveAuthToken } from "./token";

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(context = undefined) {
  let cookies = parseCookies(context);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`
    }
  });
  
  api.interceptors.response.use(response => response, (error: AxiosError) => {
    if(error.response.status === 401) {
      if(error.response.data?.code === "token.expired") {
        cookies = parseCookies(context);
        const { "nextauth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;
  
        if(!isRefreshing) {
          isRefreshing = true;
          api.post("/refresh", { refreshToken }).then(res => {
            const { token, refreshToken: newRefreshToken } = res.data;
            saveAuthToken(context, token, newRefreshToken);
  
            failedRequestsQueue.forEach(request => request.onSuccess(token));
            failedRequestsQueue = [];
          }).catch(() => {
            failedRequestsQueue.forEach(request => request.onFailure());
            failedRequestsQueue = [];

            deleteAuthToken(context);
          }).finally(() => {
            isRefreshing = false;
          });
        };
  
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            }
          });
        });
      } else {
        deleteAuthToken(context);
      };
    };
  
    return Promise.reject(error);
  });

  return api;
};

export const api = setupAPIClient();