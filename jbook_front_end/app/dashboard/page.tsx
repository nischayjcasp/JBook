import isAuthenticated from "@/lib/auth/isAuthenticated";
import Dashboard from "./Dashboard";
import { redirect } from "next/navigation";

const Page = async () => {
  return <Dashboard />;
};

export default Page;
