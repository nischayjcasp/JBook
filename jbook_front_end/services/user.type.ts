export interface userData {
  user_id: string;
  display_name: string;
  email: string;
  dob: string;
  gender: string;
  mobile_no: string;
  profile_photo: string;
  username: string;
  password: string | undefined;
}

export interface FoundAccsType {
  user_id: string;
  email: string | null;
  mobile: string | null;
}

export interface FetchAccListRes {
  status: number;
  message: string;
  users: FoundAccsType[];
}

export interface DeleteUserPayload {
  user_id: string;
  reason_for_delete?: string;
  email: string;
  password: string;
  user_consent: boolean;
}
