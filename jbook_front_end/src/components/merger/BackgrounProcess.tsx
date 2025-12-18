"use client";

import { AppDispatch, ReduxStore } from "@/src/redux/store";
import {
  mergeFailure,
  mergerReset,
  stopMerging,
} from "@/src/redux/slices/mergerSlice";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";

const BackgrounProcess = ({
  data,
}: {
  data: { mergedPosts: number; totalPosts: number };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mergedPosts, totalPosts } = data;
  const [mergeProcess, setMergeProcess] = useState<number>(75);

  useEffect(() => {
    const percentage = (mergedPosts * 100) / totalPosts;
    setMergeProcess(percentage);
  }, [mergedPosts]);

  const stopMergingRightNow = () => {
    const MergedPosts = ReduxStore.getState().merger.mergingProgress.mergedPost;
    const TotalPosts = ReduxStore.getState().merger.mergingProgress.totalPost;

    dispatch(stopMerging({ mergedPosts: MergedPosts, totalPosts: TotalPosts }));
    dispatch(mergeFailure());
  };

  return (
    <div
      className="absolute bottom-4 right-7 z-1500 w-lg rounded-lg bg-white p-4"
      style={{
        boxShadow: "0 0 9px rgba(0,0,0,0.3)",
      }}
    >
      <p className="font-semibold mb-1.5">Merging process...</p>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <LinearProgress variant="determinate" value={mergeProcess} />
        </div>
        <p className="font-semibold">{mergeProcess}%</p>
        <button
          type="button"
          className="p-1.5 flex items-center gap-2 cursor-pointer"
          onClick={stopMergingRightNow}
        >
          <FaRegStopCircle className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default BackgrounProcess;
