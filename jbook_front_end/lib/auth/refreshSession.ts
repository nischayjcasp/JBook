import { refreshSessionAPI } from "@/services/auth.service";

export const refreshSession = async (): Promise<boolean> => {
  const refreshTokenRes = await refreshSessionAPI();

  console.log("refreshTokenRes: ", refreshTokenRes.data);

  if (refreshTokenRes.status === 200) {
    return true;
  } else {
    return false;
  }
};
