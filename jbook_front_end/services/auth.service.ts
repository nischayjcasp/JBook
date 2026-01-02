import API from "@/lib/api";
import {
  EmailLoginPayloadType,
  EmailSignupPayloadType,
  FacebookSignupPayload,
  GoogleSignupPayload,
  LoginApiRes,
} from "./auth.type";
import axios from "axios";

// <================ Login ================>

export const emailLoginAPI = (
  emailLoginPayload: EmailLoginPayloadType
): Promise<LoginApiRes> => {
  return API.post("/auth/login/email", emailLoginPayload);
};

export const googleLoginAPI = (
  payload: GoogleSignupPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/login/google",
    {
      user_agent: payload.user_agent,
      device_ip: payload.device_ip,
      device_lat: payload.device_lat,
      device_long: payload.device_long,
    },
    {
      headers: {
        Authorization: payload.authCode,
      },
    }
  );
};

export const facebookLoginAPI = (
  payload: FacebookSignupPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/login/facebook",
    {
      user_agent: payload.user_agent,
      device_ip: payload.device_ip,
      device_lat: payload.device_lat,
      device_long: payload.device_long,
    },
    {
      headers: {
        Authorization: `Bearer ${payload.access_token}`,
      },
    }
  );
};

export const linkedInLoginAPI = (
  payload: GoogleSignupPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/login/linkedin",
    {
      user_agent: payload.user_agent,
      device_ip: payload.device_ip,
      device_lat: payload.device_lat,
      device_long: payload.device_long,
    },
    {
      headers: {
        Authorization: payload.authCode,
      },
    }
  );
};

// <================ Logout ================>

export const logoutAPI = (): Promise<LoginApiRes> => {
  return API.get("/auth/logout");
};

// <================ Sign up ================>

export const emailSingupAPI = (
  emailSingupPayload: EmailSignupPayloadType
): Promise<LoginApiRes> => {
  return API.post("/auth/signup/email", emailSingupPayload);
};

export const googleSingupAPI = (
  payload: GoogleSignupPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/signup/google",
    {
      user_agent: payload.user_agent,
      device_ip: payload.device_ip,
      device_lat: payload.device_lat,
      device_long: payload.device_long,
    },
    {
      headers: {
        Authorization: payload.authCode,
      },
    }
  );
};

export const facebookSingupAPI = (
  payload: FacebookSignupPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/signup/facebook",
    {
      user_agent: payload.user_agent,
      device_ip: payload.device_ip,
      device_lat: payload.device_lat,
      device_long: payload.device_long,
    },
    {
      headers: {
        Authorization: `Bearer ${payload.access_token}`,
      },
    }
  );
};

export const linkedInSingupAPI = (
  payload: GoogleSignupPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/signup/linkedin",
    {
      user_agent: payload.user_agent,
      device_ip: payload.device_ip,
      device_lat: payload.device_lat,
      device_long: payload.device_long,
    },
    {
      headers: {
        Authorization: payload.authCode,
      },
    }
  );
};

// <================ Others ================>

export const getDeivceIpAPI = () => {
  return axios.get("https://ipinfo.io/json");
};

export const verifySessionAPI = (token: string) => {
  return API.get("/session/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const refreshSessionAPI = () => {
  return API.get<{ status: number; message: string }>("/auth/refresh/token");
};
