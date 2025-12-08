"use client";

import React, { useEffect, useState } from "react";
import Merger_1 from "./Merger_1";
import Merger_2 from "./Merger_2";
import Merger_3 from "./Merger_3";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Merger_4 from "./Merger_4";

const Merger = () => {
  const router = useRouter();
  const mergerActiveStep = useSelector(
    (state: RootState) => state.merger.mergerActiveStep
  );

  useEffect(() => {
    console.log("mergerActiveStep", mergerActiveStep);
  }, [mergerActiveStep]);
  return (
    <div className="relative flex-1 w-full min-h-full flex flex-col">
      <Merger_1 active={mergerActiveStep === 1} />

      <Merger_2 active={mergerActiveStep === 2} />

      <Merger_3 active={mergerActiveStep === 3} />

      <Merger_4 active={mergerActiveStep === 4} />
    </div>
  );
};

export default Merger;
