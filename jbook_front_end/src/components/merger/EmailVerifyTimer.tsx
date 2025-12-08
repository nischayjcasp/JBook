import { SelectedAccType } from "@/app/merger/Merger_1";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const EmailVerifyTimer = ({
  props,
}: {
  props: {
    inx: number;
    selectedAcc: SelectedAccType[];
    setSelectedAcc: React.Dispatch<React.SetStateAction<SelectedAccType[]>>;
  };
}) => {
  const { inx, selectedAcc, setSelectedAcc } = props;
  const [seconds, setSeconds] = useState<number>(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const incTimer = () => {
    setSeconds((prev) => {
      if (prev <= 1) {
        stopTimer();
        return 0;
      }
      return prev - 1;
    });
  };

  const startTimer = () => {
    timerRef.current = setInterval(incTimer, 1000);
  };

  useEffect(() => {
    if (selectedAcc[inx].startTimer) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [selectedAcc[inx].startTimer]);

  useEffect(() => {
    if (seconds <= 0) {
      let temp = [...selectedAcc];
      temp[inx].isExpired = true;
      temp[inx].startTimer = false;
      setSelectedAcc(temp);
      toast.error(`Verification link in ${temp[inx].emailId} expired!`);
    }
  }, [seconds]);

  return (
    <div className="inline-flex items-center justify-center">
      <p className="w-6 h-6 text-red-700 font-semibold text-center">
        {seconds}
      </p>
    </div>
  );
};

export default EmailVerifyTimer;
