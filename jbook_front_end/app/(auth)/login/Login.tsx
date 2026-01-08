"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import googleLogo from "@/app/assets/logos/google_logo.svg";
import facebookLogo from "@/app/assets/logos/fb_logo.svg";
import { FaLinkedin } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, LoginSchemaType } from "@/lib/schemas/auth.schema";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import {
  emailLoginAPI,
  facebookLoginAPI,
  getDeivceIpAPI,
  googleLoginAPI,
  linkedInLoginAPI,
} from "@/services/auth.service";
import { DeviceId, DeviceLocation } from "@/util/common.util";
import {
  EmailLoginPayloadType,
  GoogleFBSignupPayload,
} from "@/services/auth.type";
import { useDispatch } from "react-redux";
import { setSession, setUserdata } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginPassEye, setLoginPassEye] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [isLoadingFacebook, setLoadingFacebook] = useState<boolean>(false);
  const [isLoadingLinkedIn, setLoadingLinkedIn] = useState<boolean>(false);

  let isLoginDone = useRef<boolean>(false);

  const params = useSearchParams();
  const linkendInCode = params.get("code");
  const linkendInCallback = params.get("callback");

  //  Login with Linked
  useEffect(() => {
    const handleLinkedLogin = async (code: string) => {
      console.log("code: ", code);
      setLoadingLinkedIn(true);
      try {
        //Sign up payload
        const deviceIpRes = await getDeivceIpAPI();
        const deviceIp = await DeviceLocation();

        const payload: GoogleFBSignupPayload = {
          authCode: code,
          user_agent: navigator.userAgent,
          device_ip: deviceIpRes.data?.ip ?? null,
          device_lat: deviceIp.lat,
          device_long: deviceIp.long,
        };

        const linkedInLoginRes = await linkedInLoginAPI(payload);

        console.log("linkedInLoginRes: ", linkedInLoginRes);

        if (linkedInLoginRes.status === 200) {
          toast.success(linkedInLoginRes.message);
          router.replace("/dashboard");
        } else {
          toast.error(linkedInLoginRes.message);
        }
      } catch (error) {
        console.log("Error: ", error);
        let err = error as { message: string };
        toast.error(err.message);
        redirect("/login");
      } finally {
        isLoginDone.current = false;
        setLoadingLinkedIn(false);
      }
    };

    if (!isLoginDone.current && linkendInCode && linkendInCallback) {
      isLoginDone.current = true;
      console.log("linkendInCode: ", linkendInCode);
      handleLinkedLogin(linkendInCode);
    }
  }, []);

  // Login with Email
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
      login_email: "ram8606@gmail.com",
      login_password: "Ram@@8606",
    },
  });

  const handleEmailLogin = async (data: LoginSchemaType) => {
    setLoading(true);

    const device_id: string = DeviceId();
    const deviceIpRes = await getDeivceIpAPI();
    const deviceIp = await DeviceLocation();

    console.log("deviceIpResp: ", deviceIp);

    try {
      const payload: EmailLoginPayloadType = {
        login_email: data.login_email,
        login_password: data.login_password,
        user_agent: navigator.userAgent,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };
      const emailLoginRes = await emailLoginAPI(payload);

      console.log("emailLoginRes: ", emailLoginRes);

      if (emailLoginRes.status === 200) {
        dispatch(setSession(emailLoginRes.access_token));
        dispatch(
          setUserdata({
            userId: emailLoginRes.user_id,
          })
        );
        loginReset();
        toast.success(emailLoginRes.message);
        router.replace("/dashboard");
      } else {
        toast.error(emailLoginRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Login with google
  const [googleClient, setGoogleClient] = useState<any>(null);

  const setGoogleClientFunc = () => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        callback: handleGoogleLoginCallback,
      });

      setGoogleClient(client);
    } else {
      console.log("No window.google");
    }
  };

  // Set Google client
  useEffect(() => {
    setGoogleClientFunc();
  }, []);

  const handleGoogleLoginCallback = async (response: any) => {
    console.log("Code: ", response.code);
    setLoadingGoogle(true);

    try {
      //Sign up payload
      const deviceIpRes = await getDeivceIpAPI();
      const deviceIp = await DeviceLocation();

      const payload: GoogleFBSignupPayload = {
        authCode: response.code,
        user_agent: navigator.userAgent,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };

      const googleLoginRes = await googleLoginAPI(payload);

      console.log("googleSignupRes: ", googleLoginRes);

      if (googleLoginRes.status === 200) {
        toast.success(googleLoginRes.message);
        router.replace("/dashboard");
      } else {
        toast.error(googleLoginRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!googleClient) {
      console.log("No google client!", googleClient);
      setGoogleClientFunc();
      toast.error("Google client no available, please refresh page!");
    }
    googleClient.requestCode();
  };

  // Login with Facebook
  const handleFacebookLogin = () => {
    window.FB.login(
      function (response: any) {
        console.log("response: ", response);
        if (response.authResponse && response.authResponse.accessToken) {
          facebookLoginCallback(response.authResponse);
        } else {
          toast.error("Failed to login with facebook");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  const facebookLoginCallback = async (authResp: any) => {
    console.log("FB Token:", authResp);
    setLoadingFacebook(true);
    // {
    //   accessToken: "string";
    //   data_access_expiration_time: number;
    //   expiresIn: number;
    //   graphDomain: "string";
    //   signedRequest: "string";
    //   userID: "string";
    // }

    try {
      //Sign up payload
      const deviceIpRes = await getDeivceIpAPI();
      const deviceIp = await DeviceLocation();

      const payload: GoogleFBSignupPayload = {
        access_token: authResp.accessToken,
        user_agent: navigator.userAgent,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };

      const facebookSignupRes = await facebookLoginAPI(payload);

      console.log("facebookSignupRes: ", facebookSignupRes);

      if (facebookSignupRes.status === 200) {
        toast.success(facebookSignupRes.message);
        router.replace("/dashboard");
      } else {
        toast.error(facebookSignupRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoadingFacebook(false);
    }
  };

  // Login with Facebook
  const handleLoginWithLinkedIn = () => {
    const linkedUrlParameters = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_LINKED_IN_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_LOGIN_REDIRECT_URI!,
      scope: "openid profile email",
    });

    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${linkedUrlParameters}`;
  };

  return (
    <div className="w-full h-full min-h-screen flex">
      {/* Login Form */}
      <div className="w-full md:w-1/2 px-4 sm:px-7 lg:px-16 xl:px-24 py-5 md:py-10">
        {/* JBook Logo */}
        <div className="flex items-end mb-7">
          <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
          <span className="font-medium text-3xl leading-none">Book</span>
        </div>

        <p className="font-semibold text-2xl sm:text-3xl leading-normal mb-12">
          Welcome back!
        </p>

        <form className="w-full" onSubmit={loginSubmit(handleEmailLogin)}>
          {/* Login with Third party */}
          <ul className="flex flex-col gap-3">
            {/* Google */}
            <li>
              <button
                type="button"
                disabled={isLoadingGoogle}
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white hover:bg-slate-100 rounded-lg cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                onClick={handleGoogleLogin}
              >
                <Image
                  src={googleLogo}
                  alt="Google Logo"
                  className="w-[18px] h-[18px]"
                />
                <span className="font-semibold text-lg">
                  Continue with Google
                </span>

                {isLoadingGoogle && (
                  <CircularProgress
                    size={24}
                    sx={{
                      "&.MuiCircularProgress-root": {
                        color: "#62748e",
                      },
                    }}
                  />
                )}
              </button>
            </li>

            {/* Facebook */}
            <li>
              <button
                type="button"
                disabled={isLoadingFacebook}
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white hover:bg-slate-100 rounded-lg cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                onClick={handleFacebookLogin}
              >
                <Image
                  src={facebookLogo}
                  alt="Google Logo"
                  className="w-[18px] h-[18px]"
                />
                <span className="font-semibold text-lg">
                  Continue with Facebook
                </span>

                {isLoadingFacebook && (
                  <CircularProgress
                    size={24}
                    sx={{
                      "&.MuiCircularProgress-root": {
                        color: "#62748e",
                      },
                    }}
                  />
                )}
              </button>
            </li>

            {/* Linked in */}
            <li>
              <button
                type="button"
                disabled={isLoadingLinkedIn}
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white hover:bg-slate-100 rounded-lg cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                onClick={handleLoginWithLinkedIn}
              >
                <FaLinkedin className="w-[18px] h-[18px] text-[#2e78b6]" />
                <span className="font-semibold text-lg">
                  Continue with Linked
                </span>
                {isLoadingLinkedIn && (
                  <CircularProgress
                    size={24}
                    sx={{
                      "&.MuiCircularProgress-root": {
                        color: "#62748e",
                      },
                    }}
                  />
                )}
              </button>
            </li>
          </ul>

          <hr className="my-4 w-full h-px border-none bg-slate-300" />

          {/* Login Email */}
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
                            className="cursor-pointer"
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
            disabled={isLoading}
            className="w-full py-3 bg-primary disabled:bg-slate-200 cursor-pointer disabled:cursor-default text-white disabled:text-slate-500 font-semibold text-lg rounded-lg flex justify-center items-center gap-2"
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
            Log in
          </button>

          <div className="my-4">
            <Link href="/forget" className="text-sm underline text-primary">
              Forgot you password?
            </Link>
          </div>

          <hr className="my-4 w-full h-px border-none bg-slate-200" />

          <p className="my-4 flex justify-center items-center gap-3">
            <span className="text-sm">Don't have account ?</span>
            <button
              type="button"
              className="font-medium underline text-primary cursor-pointer"
              onClick={() => {
                loginClearErrors();
                router.push("/signup");
              }}
            >
              Sign Up
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

export default Login;
