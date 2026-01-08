import API from "@/lib/api";
import { LoginApiRes } from "./auth.type";
import { FetchAccListRes, userData } from "./user.type";
import { ReduxStore } from "@/redux/store";
import { setUserdata } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";

export const fetchUserAPI = (): Promise<{
  status: number;
  message: string;
  user: userData;
}> => {
  return API.get(`/user/fetch`);
};

export const fetchUserData = async () => {
  try {
    const userDataRes = await fetchUserAPI();

    console.log("userDataRes: ", userDataRes);

    if (userDataRes && userDataRes.status === 200) {
      ReduxStore.dispatch(
        setUserdata({
          userId: userDataRes.user.user_id,
          userName: userDataRes.user.username,
          userDisplayName: userDataRes.user.display_name,
          userDob: userDataRes.user.dob,
          userGender: userDataRes.user.gender,
          userEmail: userDataRes.user.email,
          userPhoto: userDataRes.user.profile_photo,
          conncetedAcc: [],
        })
      );

      // toast.success(userDataRes.message);
    } else {
      toast.error(userDataRes.message ?? "Something went wrong!");
    }
  } catch (error: unknown) {
    console.log("Error: ", error);
    const err = error as { message: string };
    toast.error(err.message);
  }
};

export const fetchAccListAPI = (text: string): Promise<FetchAccListRes> => {
  return API.get(`/user/fetch/emails?search=${text}`);
};

export const fetchUserByIdAPI = (
  user_id: string
): Promise<{ status: number; message: string; user: userData }> => {
  return API.get(`/user/fetch/${user_id}`);
};

export const updateUserAPI = async (
  user_id: string,
  updateUserData: FormData
): Promise<{ status: number; message: string; user: userData }> => {
  return API.post(`user/update/${user_id}`, updateUserData);
};
