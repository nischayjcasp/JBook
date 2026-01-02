import { verifySessionAPI } from "@/services/auth.service";
import { cookies } from "next/headers";

const isAuthenticated = async () => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("MERGER_ACCESS_TOKEN")?.value;
  const session = cookieStore.get("MERGER_SESSION")?.value;

  if (!access_token || !session) {
    return false;
  }
  const verifySessionRes = await verifySessionAPI(access_token);

  console.log("verifySessionRes: ", verifySessionRes);

  if (verifySessionRes.status === 200) {
    return true;
  } else {
    return false;
  }
};

export default isAuthenticated;
