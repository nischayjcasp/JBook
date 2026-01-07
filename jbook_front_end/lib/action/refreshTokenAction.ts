"use server";

import { cookies } from "next/headers";
import API from "../api";
import { refreshSession } from "../auth/refreshSession";

export async function refreshTokenAction() {
  const cookieStore = await cookies();
  const session_id = cookieStore.get("MERGER_SESSION")?.value;

  if (session_id) {
    try {
      console.log(
        "<=================refreshTokenAction start================>"
      );

      console.log();
      const refreshTokenRes = await refreshSession(session_id);

      return refreshTokenRes;
    } catch (error) {
      console.log("refreshTokenAction-Error: ", error);
      return false;
    } finally {
      console.log("<=================refreshTokenAction end================>");
    }
  }
}
