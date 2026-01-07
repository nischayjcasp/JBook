"use server";

import { refreshSessionAPI } from "@/services/auth.service";
import { cookies } from "next/headers";

export const refreshSession = async (session_id: string): Promise<boolean> => {
  try {
    const refreshTokenRes = await refreshSessionAPI(session_id);
    const cookieStore = await cookies();

    console.log("refreshTokenRes: ", refreshTokenRes.data);

    const setCookieHeader = refreshTokenRes.headers["set-cookie"];
    // d

    if (!setCookieHeader) {
      return false;
    }

    console.log(
      "setCookieHeader: ",
      typeof setCookieHeader,
      setCookieHeader.toString().split(";")
    );

    cookieStore.set(
      setCookieHeader.toString().split("=")[0],
      setCookieHeader?.toString().split("=")[1].split(";")[0],
      {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        expires: new Date(Date.now() + 15 * 60 * 1000),
      }
    );

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
