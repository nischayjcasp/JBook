"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import googleLogo from "@/app/assets/logos/google_logo.svg";
import facebookLogo from "@/app/assets/logos/fb_logo.svg";
import { FaLinkedin, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema, SignupSchemaType } from "@/lib/schemas/auth.schema";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const navigate = useRouter();
  const [signUpPassEye, setSignUpPassEye] = useState<boolean>(false);
  const [signUpCPassEye, setSignUpCPassEye] = useState<boolean>(false);

  // Sign up form
  const {
    handleSubmit: signupSubmit,
    control: signupControl,
    setValue: signupSetValue,
    getValues: signupGetValues,
    clearErrors: signupClearErrors,
    reset: signupReset,
    formState: { errors: signupErrors },
  } = useForm<SignupSchemaType>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      signup_username: "",
      signup_dob: undefined,
      signup_gender: "",
      signup_email: "",
      signup_password: "",
      signup_cpassword: "",
    },
  });

  const handleSignUp = (data: SignupSchemaType) => {
    console.log(data);
  };

  return (
    <div className="w-full h-full max-h-screen flex overflow-hidden">
      {/* Sign Up forms */}
      <div className="w-full md:w-1/2 px-4 sm:px-7 lg:px-16 xl:px-24 py-5 md:py-10 overflow-y-auto hideScrollBar">
        {/* JBook Logo */}
        <div className="flex items-end mb-7">
          <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
          <span className="font-medium text-3xl leading-none">Book</span>
        </div>

        <p className="font-semibold text-2xl sm:text-3xl leading-normal mb-12">
          Sign Up
        </p>

        <form className="w-full" onSubmit={signupSubmit(handleSignUp)}>
          {/* Sign up with */}
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
                  Continue with Facebook
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
                  Continue with LinkedIn
                </span>
              </button>
            </li>
          </ul>

          <hr className="my-4 w-full h-px border-none bg-slate-300" />
          {/* Username */}
          <div className="mb-2">
            <Controller
              name="signup_username"
              control={signupControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  label="Username"
                  placeholder="Enter username "
                  name={name}
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  className="w-full"
                  error={signupErrors.signup_username?.message ? true : false}
                  helperText={
                    signupErrors.signup_username?.message
                      ? `${signupErrors.signup_username.message}`
                      : " "
                  }
                />
              )}
            />
          </div>

          {/* Birthdate */}
          <div className="mb-2">
            <Controller
              name="signup_dob"
              control={signupControl}
              render={({ field: { value, onChange, name } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name={name}
                    label="Birthdate"
                    format="DD-MM-YYYY"
                    value={value ? dayjs(value) : dayjs("dd-mm-yyyy")}
                    onChange={onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: signupErrors.signup_dob?.message ? true : false,
                        helperText: signupErrors.signup_dob?.message
                          ? `${signupErrors.signup_dob.message}`
                          : " ",
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </div>

          {/* Gender */}
          <div className="mb-2">
            <Controller
              name="signup_gender"
              control={signupControl}
              render={({ field: { name, value, onChange } }) => (
                <div>
                  <div className="px-2 flex items-center gap-3">
                    <p className="font-medium">Gender : </p>
                    <RadioGroup
                      row
                      name={name}
                      value={value}
                      onChange={onChange}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                    </RadioGroup>
                  </div>
                  <p className="text-xs px-3.5 text-[#D32F2F]">
                    {signupErrors.signup_gender?.message ? (
                      `${signupErrors.signup_gender.message}`
                    ) : (
                      <>&nbsp;</>
                    )}
                  </p>
                </div>
              )}
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <Controller
              name="signup_email"
              control={signupControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  label="Email"
                  placeholder="Enter email "
                  name={name}
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  className="w-full"
                  error={signupErrors.signup_email?.message ? true : false}
                  helperText={
                    signupErrors.signup_email?.message
                      ? `${signupErrors.signup_email.message}`
                      : " "
                  }
                />
              )}
            />
          </div>

          {/* Sign up Password */}
          <div className="mb-2">
            <Controller
              name="signup_password"
              control={signupControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  type={signUpPassEye ? "text" : "password"}
                  label="Password"
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
                            onClick={() => setSignUpPassEye(!signUpPassEye)}
                          >
                            {signUpPassEye ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={signupErrors.signup_password?.message ? true : false}
                  helperText={
                    signupErrors.signup_password?.message
                      ? `${signupErrors.signup_password.message}`
                      : " "
                  }
                />
              )}
            />
          </div>

          {/* Sign up Confirm Password */}
          <div className="mb-2">
            <Controller
              name="signup_cpassword"
              control={signupControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  type={signUpCPassEye ? "text" : "password"}
                  label="Confirm Password"
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
                            onClick={() => setSignUpCPassEye(!signUpCPassEye)}
                          >
                            {signUpCPassEye ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={signupErrors.signup_cpassword?.message ? true : false}
                  helperText={
                    signupErrors.signup_cpassword?.message
                      ? `${signupErrors.signup_cpassword.message}`
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
            Sign up with Email
          </button>

          <hr className="my-4 w-full h-px border-none bg-slate-200" />
          <p className="my-4 flex justify-center items-center gap-3">
            <span className="text-sm">Already have account ?</span>
            <button
              type="button"
              className="font-medium underline text-primary cursor-pointer"
              onClick={() => {
                navigate.push("/");
                signupClearErrors();
              }}
            >
              Login
            </button>
          </p>
        </form>
      </div>

      {/* Cover Slide */}
      <div
        className={`w-1/2 p-5 hidden md:flex flex-col justify-center items-center bg-[#1C2A39] z-10 border border-slate-200 transition-transform duration-200`}
      >
        {/* JBook Logo */}
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

export default SignUp;
