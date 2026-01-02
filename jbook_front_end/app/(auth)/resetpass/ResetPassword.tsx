"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  resetPassSchema,
  ResetPassSchemaType,
} from "@/lib/schemas/auth.schema";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const [resetPassEye, setResetPassEye] = useState<boolean>(false);
  const [resetCPassEye, setResetCPassEye] = useState<boolean>(false);

  useEffect(() => {
    console.log("Code: ", searchParams.get("code"));
  }, []);

  // Password reset Form
  const {
    handleSubmit: resetPassSubmit,
    control: resetPassControl,
    reset: resetPassReset,
    formState: { errors: resetPassErrors },
  } = useForm<ResetPassSchemaType>({
    resolver: yupResolver(resetPassSchema),
  });

  const handleResetPass = (data: ResetPassSchemaType) => {
    console.log(data);
  };

  return (
    <div className="w-full h-full min-h-screen flex">
      {/* Login Form */}
      <div className="w-full md:w-1/2 px-4 sm:px-7 lg:px-16 xl:px-24 py-5 md:py-10">
        {/* JBook Logo */}
        <div className="flex items-end mb-16">
          <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
          <span className="font-medium text-3xl leading-none">Book</span>
        </div>

        <p className="font-semibold text-2xl sm:text-[34px] leading-normal mb-3">
          Password reset
        </p>

        <p className="mb-2 text-sm">
          Please enter a new password for your JBook account.
        </p>
        <p className="mb-7 text-sm">
          This will end all active sessions for your account from all devices.
        </p>

        <form className="w-full" onSubmit={resetPassSubmit(handleResetPass)}>
          {/* Reset New Password */}
          <div className="mb-2">
            <Controller
              name="reset_password"
              control={resetPassControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  type={resetPassEye ? "text" : "password"}
                  label="New Password"
                  placeholder="Enter password "
                  name={name}
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  className="w-full"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => setResetPassEye(!resetPassEye)}
                          >
                            {resetPassEye ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={resetPassErrors.reset_password?.message ? true : false}
                  helperText={
                    resetPassErrors.reset_password?.message
                      ? `${resetPassErrors.reset_password.message}`
                      : " "
                  }
                />
              )}
            />
          </div>

          {/* Reset Confirm New Password */}
          <div className="mb-2">
            <Controller
              name="reset_cpassword"
              control={resetPassControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  type={resetCPassEye ? "text" : "password"}
                  label="Confirm New Password"
                  placeholder="Enter confirm password"
                  name={name}
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  className="w-full"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => setResetCPassEye(!resetCPassEye)}
                          >
                            {resetCPassEye ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={
                    resetPassErrors.reset_cpassword?.message ? true : false
                  }
                  helperText={
                    resetPassErrors.reset_cpassword?.message
                      ? `${resetPassErrors.reset_cpassword.message}`
                      : " "
                  }
                />
              )}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary cursor-pointer text-white font-semibold text-lg rounded-lg"
          >
            Reset my password
          </button>

          <hr className="my-4 w-full h-px border-none bg-slate-200" />

          <p className="my-4 flex justify-center items-center gap-3">
            <span className="text-sm">Need additional help?</span>
            <button
              type="button"
              className="font-medium underline text-primary cursor-pointer"
            >
              Contact Us
            </button>
          </p>
        </form>
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

export default ResetPassword;
