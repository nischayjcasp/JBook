export interface EmailLoginPayloadType {
  login_email: string;
  login_password: string;
  user_agent: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface LoginApiRes {
  status: number;
  message: string;
  error_message?: string;
  access_token?: string;
  user_id?: string;
  userData?: {
    user_email: string;
    user_photo: string | null;
    userName: string;
  };
}

export interface EmailSignupPayloadType {
  signup_username: string;
  signup_dob: Date;
  signup_gender: string;
  signup_mobile: string;
  signup_email: string;
  signup_password: string;
  user_agent: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface GoogleSignupPayload {
  authCode: string;
  user_agent: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface FacebookSignupPayload {
  access_token: string;
  user_agent: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface LinkedInSignupPayload {
  authCode: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface FotgotPasswordPayload {
  forgot_pass_email: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface ResetPasswordPayload {
  new_pass: string;
  resetCode: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}
