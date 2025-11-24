import DefaultNavBar from "@/components/dashboard/DefaultNavBar";
import { ReactNode } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen">
      <DefaultNavBar />
      {children}
    </div>
  );
};

export default UserLayout;
