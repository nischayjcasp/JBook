import API from "@/lib/api";
import {
  EmailLoginPayloadType,
  EmailSignupPayloadType,
  FotgotPasswordPayload,
  GoogleFBSignupPayload,
  LoginApiRes,
  ResetPasswordPayload,
} from "./auth.type";
import axios from "axios";

// <================ Login ================>

export const emailLoginAPI = (
  emailLoginPayload: EmailLoginPayloadType
): Promise<LoginApiRes> => {
  return API.post("/auth/login/email", emailLoginPayload);
};

export const googleLoginAPI = (
  payload: GoogleFBSignupPayload
): Promise<LoginApiRes> => {
  const authHeader = payload.authCode
    ? payload.authCode
    : `Bearer ${payload.access_token}`;

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
        Authorization: authHeader,
      },
    }
  );
};

export const facebookLoginAPI = (
  payload: GoogleFBSignupPayload
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
  payload: GoogleFBSignupPayload
): Promise<LoginApiRes> => {
  const authHeader = payload.authCode
    ? payload.authCode
    : `Bearer ${payload.access_token}`;

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
        Authorization: authHeader,
      },
    }
  );
};

export const otpVerifyLoginAPI = async (
  otpPayload: Partial<FotgotPasswordPayload>
): Promise<LoginApiRes> => {
  return API.post("/auth/login/otp", otpPayload);
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
  payload: GoogleFBSignupPayload
): Promise<LoginApiRes> => {
  const authHeader = payload.authCode
    ? payload.authCode
    : `Bearer ${payload.access_token}`;

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
        Authorization: authHeader,
      },
    }
  );
};

export const facebookSingupAPI = (
  payload: GoogleFBSignupPayload
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
  payload: GoogleFBSignupPayload
): Promise<LoginApiRes> => {
  const authHeader = payload.authCode
    ? payload.authCode
    : `Bearer ${payload.access_token}`;

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
        Authorization: authHeader,
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

export const refreshSessionAPI = (session_id: string) => {
  return axios.get<{ status: number; message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh/token`,
    {
      headers: {
        Cookie: `session_id=${session_id}`,
      },
    }
  );
};

export const forgotPasswordAPI = (
  forgotPassPayload: FotgotPasswordPayload
): Promise<LoginApiRes> => {
  return API.post("/auth/forgot/password", forgotPassPayload);
};

export const resetPasswordAPI = (
  resetPassPayload: ResetPasswordPayload
): Promise<LoginApiRes> => {
  return API.post(
    "/auth/reset/password",
    {
      new_pass: resetPassPayload.new_pass,
      device_ip: resetPassPayload.device_ip,
      device_lat: resetPassPayload.device_lat,
      device_long: resetPassPayload.device_long,
    },
    {
      headers: {
        Authorization: resetPassPayload.resetCode,
      },
    }
  );
};

export const sentOtpAPI = (user_id: string): Promise<LoginApiRes> => {
  return API.get(`/auth/email/otp/${user_id}`);
};

export const otpVerifyAPI = async (
  otpPayload: Partial<FotgotPasswordPayload>
): Promise<LoginApiRes> => {
  return API.post("/auth/email/otp/verify", otpPayload);
};

export const resendOtpAPI = async (): Promise<LoginApiRes> => {
  return API.get("/auth/login/otp/resend");
};
