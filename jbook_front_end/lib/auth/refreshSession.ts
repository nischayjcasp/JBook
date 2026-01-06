import { refreshSessionAPI } from "@/services/auth.service";
import { cookies } from "next/headers";

export const refreshSession = async (session_id: string): Promise<boolean> => {
  try {
    const refreshTokenRes = await refreshSessionAPI(session_id);
    const cookieStore = await cookies();

    console.log("refreshTokenRes: ", refreshTokenRes.data);

    const setCookieHeader = refreshTokenRes.headers["set-cookie"];

    console.log("setCookieHeader: ", setCookieHeader);

    if (!setCookieHeader) {
      return false;
    }

    const access_token = (setCookieHeader as any).split(";")[0].split("=")[1];

    console.log("access_token: ", access_token);

    cookieStore.set("MERGER_ACCESS_TOKEN", access_token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (refreshTokenRes.data.status === 200) {
      console.log("Refreshed");
      return true;
    } else {
      console.log("Failed Refreshed");
      return false;
    }
  } catch (error) {
    console.log("Error: ", error);
    return false;
  }
};
