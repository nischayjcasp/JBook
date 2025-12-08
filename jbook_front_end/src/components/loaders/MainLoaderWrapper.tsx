"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import MainLoader from "@/app/loading";

const MainLoaderWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isLoading = useSelector(
    (state: RootState) => state.mainLoader.isLoading
  );

  return (
    <>
      {isLoading && <MainLoader />}
      {children}
    </>
  );
};

export default MainLoaderWrapper;
