import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshTokenAction } from "../action/refreshTokenAction";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve();
  });
  failedQueue = [];
};

// Request Interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor + Refresh token login
API.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    // console.log("Axios: error", error);
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // if (isRefreshing) {
      //   return new Promise((resolve, reject) => {
      //     failedQueue.push({ resolve, reject });
      //   }).then(() => API(originalRequest));
      // }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("api url: ", error?.config?.url);

        console.log(
          "<=================refreshTokenAction start================>"
        );
        const refreshTokenRes = await refreshTokenAction();
        // processQueue(null);
        console.log(
          "<=================refreshTokenAction end================>"
        );
        // console.log("refreshTokenRes: ", refreshTokenRes);
        if (refreshTokenRes) {
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.log("refreshError: ", refreshError);
        // processQueue(refreshError);
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
