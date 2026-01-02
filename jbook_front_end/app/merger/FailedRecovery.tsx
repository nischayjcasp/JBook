import { AppDispatch, RootState } from "@/redux/store";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Image from "next/image";
import defaultImage from "@/app/assets/images/randomUser.jpeg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import MergerPostCard from "@/components/merger/MergerPostCard";
import { MdError } from "react-icons/md";
import { useRouter } from "next/navigation";
import { mergerReset } from "@/redux/slices/mergerSlice";

const FailedRecovery = ({ active }: { active: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const mergerActiveStep = useSelector(
    (state: RootState) => state.merger.mergerActiveStep
  );

  const primaryAccData = useSelector(
    (state: RootState) => state.merger.primaryAcc
  );

  const secondaryAccData = useSelector(
    (state: RootState) => state.merger.secondaryAcc
  );

  const handleCloseAction = () => {
    router.replace("/dashboard");
    dispatch(mergerReset());
  };

  return (
    <div
      className={`flex-1 top-0 left-0 right-0 min-h-full px-16 pt-7 flex flex-col ${
        active
          ? "sticky z-10 overflow-y-auto opacity-100"
          : "absolute -z-10 max-w-0 max-h-0 overflow-hidden opacity-0"
      }`}
    >
      {/* Header */}
      <div className="w-full p-4 border border-slate-400 rounded-md">
        <p className="text-center text-xl font-semibold text-red-700">
          Recovery of accounts failed due to Errors
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Check mark */}
        <div className="flex justify-center my-20">
          <MdError className="text-7xl text-red-700" />
        </div>

        {/* Accounts List */}
        <div>
          <p className="text-xl font-semibold text-center mb-4">
            Error occurred during recovering the all accounts
          </p>
          <div className="flex justify-center mb-10">
            <div className="rounded-lg py-4 px-10 flex items-center gap-x-4 border border-slate-500">
              <div className="flex items-center gap-3 border border-slate-500 p-4 rounded-lg">
                <div className="bg-slate-500 text-white p-2 rounded-lg">
                  <p className="font-semibold">Account :</p>
                </div>
                <p>{primaryAccData.email ?? ""}</p>
              </div>
              <div>AND</div>
              <div className="flex items-center gap-3 border border-slate-500 p-4 rounded-lg">
                <div className="p-2 bg-slate-500 text-white rounded-lg">
                  <p className="font-semibold">Account :</p>
                </div>
                <p>{secondaryAccData.email ?? ""}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Recovery */}
        <div className="border p-4 rounded-md">
          <p className="font-semibold text-lg text-center">
            Do you facing the error in the recovery, please retry recovering.
          </p>

          <div className="flex justify-center items-center gap-5 py-5">
            <button
              type="button"
              className="p-3 bg-primary text-white rounded-lg font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>

          <p className="text-red-700 flex justify-center gap-2">
            <span>Still facing the error no worries, please contact us on</span>
            <a
              href="mailto:customer_care@gmail.com"
              className="text-primary underline font-semibold"
            >
              customer_care@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-14 py-5 border-t border-t-slate-300 text-center">
        <button
          type="button"
          className="min-w-[90px] py-1.5 bg-red-700 rounded-sm text-white font-medium cursor-pointer"
          onClick={handleCloseAction}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FailedRecovery;
