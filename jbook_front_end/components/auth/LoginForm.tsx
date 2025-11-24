"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import googleLogo from "@/app/assets/logos/google_logo.svg";
import facebookLogo from "@/app/assets/logos/fb_logo.svg";
import { FaLinkedin } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, LoginSchemaType } from "@/lib/schemas/auth.schema";

export interface authProps {
  authState: "login" | "signup";
  setAuthState: Dispatch<SetStateAction<"login" | "signup">>;
}

const LoginForm = ({ auth }: { auth: authProps }) => {
  const { authState, setAuthState } = auth;
  const [loginPassEye, setLoginPassEye] = useState<boolean>(false);

  // Login Form
  const {
    handleSubmit: loginSubmit,
    control: loginControl,
    setValue: loginSetValue,
    getValues: loginGetValues,
    clearErrors: loginClearErrors,
    reset: loginReset,
    formState: { errors: loginErrors },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      login_email: "",
      login_password: "",
    },
  });

  const handleLogin = (data: LoginSchemaType) => {
    console.log(data);
  };

  useEffect(() => {
    loginReset();
  }, [authState]);

  return (
    <div className="w-full me-auto md:w-1/2 overflow-y-auto px-4 sm:px-7 lg:px-16 xl:px-24 py-5 md:py-10 hideScrollBar">
      {/* JBook Logo */}
      <div className="flex items-end mb-7">
        <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
        <span className="font-medium text-3xl leading-none">Book</span>
      </div>

      <p className="font-semibold text-3xl leading-normal mb-12">
        Welcome back!
      </p>

      <form className="w-full" onSubmit={loginSubmit(handleLogin)}>
        {/* Login with */}
        <ul className="flex flex-col gap-3">
          <li>
            <button
              type="button"
              className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
                  hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Image
                src={googleLogo}
                alt="Google Logo"
                className="w-[18px] h-[18px]"
              />
              <span className="font-semibold text-lg">
                Continue with Google
              </span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
                  hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Image
                src={facebookLogo}
                alt="Google Logo"
                className="w-[18px] h-[18px]"
              />
              <span className="font-semibold text-lg">
                Continue with Google
              </span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
                  hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <FaLinkedin className="w-[18px] h-[18px] text-[#2e78b6]" />
              <span className="font-semibold text-lg">
                Continue with Google
              </span>
            </button>
          </li>
        </ul>

        <hr className="my-4 w-full h-px border-none bg-slate-300" />

        {/* Email */}
        <div className="mb-2">
          <Controller
            name="login_email"
            control={loginControl}
            render={({ field: { value, onChange, name } }) => (
              <TextField
                label="Email"
                placeholder="Enter email "
                name={name}
                value={value}
                onChange={onChange}
                variant="outlined"
                className="w-full"
                error={loginErrors.login_email?.message ? true : false}
                helperText={
                  loginErrors.login_email?.message
                    ? `${loginErrors.login_email.message}`
                    : " "
                }
              />
            )}
          />
        </div>

        {/* Login Password */}
        <div className="mb-2">
          <Controller
            name="login_password"
            control={loginControl}
            render={({ field: { value, onChange, name } }) => (
              <TextField
                type={loginPassEye ? "text" : "password"}
                label="Password"
                placeholder="Enter password "
                name={name}
                value={value}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          type="button"
                          onClick={() => setLoginPassEye(!loginPassEye)}
                        >
                          {loginPassEye ? <VisibilityOff /> : <Visibility />}
                        </button>
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={onChange}
                variant="outlined"
                className="w-full"
                error={loginErrors.login_password?.message ? true : false}
                helperText={
                  loginErrors.login_password?.message
                    ? `${loginErrors.login_password.message}`
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
          Log in
        </button>

        <div className="my-4">
          <Link
            href="/forgotPassword"
            className="text-sm underline text-primary"
          >
            Forgot you password?
          </Link>
        </div>

        <hr className="my-4 w-full h-px border-none bg-slate-200" />

        <p className="my-4 flex justify-center items-center gap-3">
          <span className="text-sm">Don't have account ?</span>
          <button
            type="button"
            className="font-medium underline text-primary cursor-pointer"
            onClick={() => setAuthState("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
