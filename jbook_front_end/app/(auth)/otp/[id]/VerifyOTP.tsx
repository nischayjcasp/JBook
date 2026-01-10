"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  OtpVerificationSchema,
  OtpVerificationType,
} from "@/lib/schemas/auth.schema";
import { useParams, useRouter } from "next/navigation";
import { FotgotPasswordPayload } from "@/services/auth.type";
import { otpVerifyLoginAPI, resendOtpAPI } from "@/services/auth.service";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { OtpInput } from "reactjs-otp-input";
import OtpTimer from "@/components/auth/OtpTimer";
import { useDispatch } from "react-redux";
import { setSession, setUserdata } from "@/redux/slices/userSlice";

const VerifyOTP = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);

  // Forgot password Form
  const {
    handleSubmit: otpSubmit,
    control: otpControl,
    reset: otpReset,
    setError: otpSetError,
    formState: { errors: otpErrors },
  } = useForm<OtpVerificationType>({
    resolver: yupResolver(OtpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (id) {
      // Start counting
      setIsTimerRunning(true);
    }
  }, []);

  useEffect(() => {
    if (isOtpExpired) {
      toast.warn("OTP is expired!");
    }
  }, [isOtpExpired]);

  const handleOtpVerification = async (data: OtpVerificationType) => {
    console.log("Data: ", data);
    setLoading(true);

    try {
      //OTP up payload
      const payload: Partial<FotgotPasswordPayload> = {
        otp_id: id as string,
        otp: data.otp,
      };

      const otpLoginRes = await otpVerifyLoginAPI(payload);

      console.log("otpLoginRes: ", otpLoginRes);

      if (otpLoginRes.status === 200) {
        dispatch(setSession(otpLoginRes.access_token));
        dispatch(
          setUserdata({
            userId: otpLoginRes.user_id,
          })
        );
        router.replace("/dashboard");
        toast.success(otpLoginRes.message);
      } else {
        toast.error(otpLoginRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const otpLoginRes = await resendOtpAPI();

      console.log("otpLoginRes: ", otpLoginRes);

      if (otpLoginRes.status === 200) {
        toast.success(otpLoginRes.message);
        router.replace(`/otp/${otpLoginRes.otp_id}`);
      } else {
        toast.error(otpLoginRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* Forgot password Form */}
      <div className="w-full md:w-1/2 px-4 sm:px-7 lg:px-16 xl:px-24 py-5 md:py-10 flex flex-col">
        {/* JBook Logo */}
        <div className="flex items-end mb-7">
          <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
          <span className="font-medium text-3xl leading-none">Book</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="font-semibold text-2xl sm:text-[32px] leading-normal mb-4">
            OTP Verification
          </p>

          <p className="text-sm">
            Please enter the OTP(One Time Password) sent to&nbsp;
            <span className="font-semibold underline underline-offset-2">
              abc@gmail.com
            </span>
            &nbsp;to complete verification.
          </p>

          <form className="w-full" onSubmit={otpSubmit(handleOtpVerification)}>
            {/* OTP */}
            <div className="my-12">
              <div className="mb-2">
                <Controller
                  name="otp"
                  control={otpControl}
                  render={({ field: { value, onChange, name } }) => (
                    <OtpInput
                      value={value}
                      onChange={onChange}
                      numInputs={6}
                      containerStyle="p-4 flex justify-center items-center gap-4"
                      inputStyle="min-w-12 h-12 text-xl font-semibold border rounded-md"
                      isDisabled={isLoading}
                      disabledStyle="bg-slate-300 border-slate-500"
                      hasErrored={otpErrors.otp ? true : false}
                      errorStyle="border-2 border-red-600"
                      isInputNum={true}
                      isInputSecure={true}
                    />
                  )}
                />

                <p className="text-sm text-red-600 min-h-5">
                  {otpErrors.otp ? otpErrors.otp.message : " "}
                </p>
              </div>

              {
                <div className="flex justify-between items-center mb-10">
                  {/* Timer */}
                  <div className="flex items-center gap-2">
                    {isTimerRunning && (
                      <>
                        <span>Remaining time:</span>
                        <OtpTimer
                          props={{
                            time: 60,
                            startTimerNow: isTimerRunning,
                            setStartTimerNow: setIsTimerRunning,
                            setIsExpired: setIsOtpExpired,
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Resend */}
                  <div className="flex items-center gap-2">
                    <span>Don't recevied the code?</span>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="font-semibold cursor-pointer text-primary disabled:text-slate-500 disabled:cursor-default flex items-center gap-1"
                      onClick={handleResendOtp}
                    >
                      {isResending && (
                        <CircularProgress
                          size={16}
                          sx={{
                            "&.MuiCircularProgress-root": {
                              color: "#62748e",
                            },
                          }}
                        />
                      )}
                      Resend
                    </button>
                  </div>
                </div>
              }
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary cursor-pointer text-white font-semibold text-lg rounded-lg disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500 flex justify-center items-center gap-2"
            >
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    "&.MuiCircularProgress-root": {
                      color: "#62748e",
                    },
                  }}
                />
              )}
              Verify
            </button>

            <hr className="mt-10 mb-4 w-full h-px border-none bg-slate-200" />

            <div className="text-center">
              <button
                type="button"
                disabled={isLoading}
                className="font-medium underline cursor-pointer text-primary disabled:text-slate-500 disabled:cursor-default"
                onClick={() => {
                  otpReset();
                  router.push("/login");
                }}
              >
                Go to login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cover Slide */}
      <div
        className={`w-1/2 p-5 hidden md:flex flex-col justify-center items-center bg-[#1C2A39] z-10 border border-slate-200 transition-transform duration-200`}
      >
        {/* Jcasp Logo */}
        <div className="flex items-end mb-14">
          <Image src={jcaspLogo} alt="JBook logo" className="max-h-[100px]" />
        </div>

        <div className="text-white text-xl flex flex-col items-center xl:items-start">
          <div className="flex flex-col lg:flex-row gap-2 mb-2">
            <p className="flex gap-2">
              <FaQuoteLeft className="text-sm" />
              <span> reader lives a thousand lives</span>
            </p>
            <p className="text-center">before he dies</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-2">
            <span>The man who never reads</span>
            <p className="flex justify-center gap-2">
              <span>lives only one.</span>
              <FaQuoteRight className="text-sm" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
