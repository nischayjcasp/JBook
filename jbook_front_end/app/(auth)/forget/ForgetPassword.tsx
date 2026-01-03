"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  forgotPassSchema,
  ForgotPassSchemaType,
} from "@/lib/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { FotgotPasswordPayload } from "@/services/auth.type";
import { forgotPasswordAPI, getDeivceIpAPI } from "@/services/auth.service";
import { DeviceLocation } from "@/util/common.util";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const ForgetPassword = () => {
  const navigate = useRouter();
  const [isResetLinkSent, setIsResetLinkSent] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  // Forgot password Form
  const {
    handleSubmit: forogtPassSubmit,
    control: forogtPassControl,
    reset: forogtPassReset,
    setError: forogtPassSetError,
    formState: { errors: forogtPassErrors },
  } = useForm<ForgotPassSchemaType>({
    resolver: yupResolver(forgotPassSchema),
    defaultValues: {
      forgot_pass_email: "",
    },
  });

  const handleForogtPass = async (data: ForgotPassSchemaType) => {
    console.log("Data: ", data);
    setLoading(true);

    try {
      //Sign up payload
      const deviceIpRes = await getDeivceIpAPI();
      const deviceIp = await DeviceLocation();

      const payload: FotgotPasswordPayload = {
        forgot_pass_email: data.forgot_pass_email,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };

      const facebookSignupRes = await forgotPasswordAPI(payload);

      console.log("facebookSignupRes: ", facebookSignupRes);

      if (facebookSignupRes.status === 200) {
        toast.success(facebookSignupRes.message);
      } else {
        toast.error(facebookSignupRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }

    // if (data.forgot_pass_email !== "ram@gmail.com") {
    //   forogtPassSetError("forgot_pass_email", {
    //     type: "custom",
    //     message: "User do not exist",
    //   });
    // } else {
    //   setIsResetLinkSent(true);
    //   // Link on email: https://app.todoist.com/auth/password?reset_code=56364218_AKbxdAKUKSkWnlporNys7wD6
    // }
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
          <p className="font-semibold text-2xl sm:text-[32px] leading-normal mb-12">
            Forgot your password?
          </p>

          <form
            className="w-full"
            onSubmit={forogtPassSubmit(handleForogtPass)}
          >
            <p className="text-sm mb-4">
              {!isResetLinkSent
                ? `To reset your password, please enter the email address of your
              Todoist account.`
                : "You've been emailed a password reset link."}
            </p>

            {!isResetLinkSent && (
              <>
                {/* Email */}
                <div className="mb-2">
                  <Controller
                    name="forgot_pass_email"
                    control={forogtPassControl}
                    render={({ field: { value, onChange, name } }) => (
                      <TextField
                        label="Email"
                        placeholder="Enter email "
                        name={name}
                        value={value}
                        disabled={isLoading}
                        onChange={onChange}
                        variant="outlined"
                        className="w-full"
                        error={
                          forogtPassErrors.forgot_pass_email?.message
                            ? true
                            : false
                        }
                        helperText={
                          forogtPassErrors.forgot_pass_email?.message
                            ? `${forogtPassErrors.forgot_pass_email.message}`
                            : " "
                        }
                      />
                    )}
                  />
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
                  Reset my password
                </button>
              </>
            )}

            <hr className="mt-10 mb-4 w-full h-px border-none bg-slate-200" />

            <div className="text-center">
              <button
                type="button"
                className="font-medium underline text-primary cursor-pointer"
                onClick={() => {
                  forogtPassReset();
                  navigate.push("/login");
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

export default ForgetPassword;
