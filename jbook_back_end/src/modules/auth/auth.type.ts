export interface GoogleTokenResType {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleUserInfoType {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export interface SignUpResType {
  status: number;
  user_id?: string;
  message?: string;
  userData?: {
    user_email: string;
    user_photo: string | null;
    userName: string;
    provider_token?: string;
  };
  session_id?: string;
  session_exp?: Date;
  access_token?: string;
  access_token_exp?: Date;
  error_message?: string;
}

export interface FailedLoginLogData {
  user_id: string;
  device_id: string;
  user_agent: string | null;
  device_ip: string | null;
  device_lat: number | null;
  device_long: number | null;
}
