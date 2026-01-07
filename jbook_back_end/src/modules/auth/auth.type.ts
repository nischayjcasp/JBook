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
  message?: string;
  userData?: {
    user_email: string;
    user_photo: string | null;
    userName: string;
  };
  session_id?: string;
  session_exp?: Date;
  access_token?: string;
  access_token_exp?: Date;
  error_message?: string;
}
