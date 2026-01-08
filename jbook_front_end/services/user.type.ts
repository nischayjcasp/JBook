export interface userData {
  user_id: string;
  display_name: string;
  email: string;
  dob: string;
  gender: string;
  mobile_no: string;
  profile_photo: string;
  username: string;
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
