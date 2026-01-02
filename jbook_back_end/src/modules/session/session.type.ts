export interface SessionData {
  userId: string;
  device_id: string;
  device_type: string | null;
  device_os: string | null;
  device_ip: string;
  device_lat: number | null;
  device_long: number | null;
}

export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
}

export interface CreatedSessionData {
  session_id: string;
  session_exp: Date;
  access_token: string;
  access_token_exp: Date;
}

export interface EndSessionResp {
  status: number;
  message: string;
}
