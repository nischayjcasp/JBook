"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MainLoader from "@/app/loading";
import BackgrounProcess from "../merger/BackgrounProcess";

const MainLoaderWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isLoading = useSelector(
    (state: RootState) => state.mainLoader.isLoading
  );
  const isMerging = useSelector(
    (state: RootState) => state.merger.mergingProgress.isMerging
  );
  const mergedPosts = useSelector(
    (state: RootState) => state.merger.mergingProgress.mergedPost
  );
  const totalPosts = useSelector(
    (state: RootState) => state.merger.mergingProgress.totalPost
  );

  return (
    <>
      {isLoading && <MainLoader />}
      {children}
      {isMerging && <BackgrounProcess data={{ mergedPosts, totalPosts }} />}
    </>
  );
};

export default MainLoaderWrapper;
