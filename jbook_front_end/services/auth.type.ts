export interface EmailLoginPayloadType {
  email: string;
  password: string;
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
  session_id?: string;
  user_id?: string;
  otp_id?: string;
  userData?: {
    user_email: string;
    user_photo: string | null;
    userName: string;
    provider_token: string;
  };
}

export interface EmailSignupPayloadType {
  display_name: string;
  dob: Date;
  gender: string;
  mobile_no: string;
  email: string;
  password: string;
  user_agent: string;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}

export interface GoogleFBSignupPayload {
  authCode?: string;
  access_token?: string;
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
  forgot_pass_email?: string;
  user_id?: string;
  otp_id?: string;
  otp?: string;
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
