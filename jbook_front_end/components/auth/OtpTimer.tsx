import React, { useEffect, useRef, useState } from "react";

const OtpTimer = ({
  props,
}: {
  props: {
    time: number;
    startTimerNow: boolean;
    setStartTimerNow: React.Dispatch<React.SetStateAction<boolean>>;
    setIsExpired: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) => {
  const { time, startTimerNow, setStartTimerNow, setIsExpired } = props;
  const [seconds, setSeconds] = useState<number>(time);
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
    if (startTimerNow) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [startTimerNow]);

  useEffect(() => {
    if (seconds <= 0) {
      setIsExpired(true);
      setStartTimerNow(false);
    }
  }, [seconds]);

  return (
    <div className="inline-flex items-center justify-center">
      <p className="w-6 h-6 text-primary font-semibold text-center">
        {seconds}
      </p>
    </div>
  );
};

export default OtpTimer;
