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
import { loginSchema, LoginSchemaType } from "@/src/lib/schemas/auth.schema";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const Login = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const [loginPassEye, setLoginPassEye] = useState<boolean>(false);

  useEffect(() => {
    console.log("Code: ", searchParams.get("code"));
  }, []);

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

  //Sign in with google: Front-end
  const [googleClient, setGoogleClient] = useState<any>(null);

  useEffect(() => {
    if (window.google) {
      const client = google.accounts.oauth2.initCodeClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        callback: handleGoogleResponse,
      });

      setGoogleClient(client);
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    console.log("Code: ", response.code);
  };

  const handleGoogleLogin = () => {
    if (!googleClient) return;
    googleClient.requestCode();
  };

  // Sign in with google backend code

  // import { NextResponse } from "next/server";

  // export async function POST(req) {
  //   const { code } = await req.json();

  //   try {
  //     const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: new URLSearchParams({
  //         code,
  //         client_id: process.env.GOOGLE_CLIENT_ID,
  //         client_secret: process.env.GOOGLE_CLIENT_SECRET,
  //         redirect_uri: "postmessage", // important for popup
  //         grant_type: "authorization_code",
  //       }),
  //     });

  //     const tokens = await tokenRes.json();

  //     const userInfoRes = await fetch(
  //       "https://www.googleapis.com/oauth2/v3/userinfo",
  //       {
  //         headers: { Authorization: `Bearer ${tokens.access_token}` },
  //       }
  //     );

  //     const user = await userInfoRes.json();

  //     return NextResponse.json({ success: true, user });
  //   } catch (e) {
  //     return NextResponse.json({ error: e.message }, { status: 400 });
  //   }
  // }

  //Sign in with facebook

  const loginWithFacebook = () => {
    FB.login(
      function (response) {
        if (response.authResponse) {
          handleFBResponse(response.authResponse);
        } else {
          console.log("User cancelled login");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  const handleFBResponse = async (authResp: any) => {
    // const res = await fetch("/api/facebook-login", {
    //   method: "POST",
    //   body: JSON.stringify({ accessToken }),
    // });
    // const data = await res.json();
    console.log("FB Token:", authResp);
  };

  // Sign in with facebook backend code
  // import { NextResponse } from "next/server";

  // export async function POST(req) {
  //   try {
  //     const { accessToken } = await req.json();

  //     // Hit Facebook Graph API to get user info
  //     const userRes = await fetch(
  //       `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
  //     );

  //     const user = await userRes.json();

  //     return NextResponse.json({
  //       success: true,
  //       user: {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         picture: user.picture?.data?.url
  //       }
  //     });

  //   } catch (e) {
  //     return NextResponse.json({ error: e.message }, { status: 400 });
  //   }
  // }

  const handleSignInWithLinkedIn = () => {
    const linkedInSignInUrl = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_LINKED_IN_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
      scope: "openid profile email",
    });

    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${linkedInSignInUrl}`;
  };

  // Sign in with linked in
  // import { NextResponse } from "next/server";

  // export async function GET(req: Request) {
  //   const { searchParams } = new URL(req.url);
  //   const code = searchParams.get("code");
  //   const error = searchParams.get("error");

  //   if (error) {
  //     return NextResponse.json({ error }, { status: 400 });
  //   }

  //   if (!code) {
  //     return NextResponse.json({ error: "Missing code" }, { status: 400 });
  //   }

  //   // 1️⃣ Exchange code for access token
  //   const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body: new URLSearchParams({
  //       grant_type: "authorization_code",
  //       code,
  //       redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
  //       client_id: process.env.LINKEDIN_CLIENT_ID!,
  //       client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
  //     }),
  //   });

  //   const tokenData = await tokenRes.json();

  //   if (!tokenData.access_token) {
  //     return NextResponse.json(tokenData, { status: 400 });
  //   }

  //   const accessToken = tokenData.access_token;

  //   // 2️⃣ Get user profile (name + sub)
  //   const profileRes = await fetch("https://api.linkedin.com/v2/me", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  //   const profile = await profileRes.json();

  //   // 3️⃣ Get user email
  //   const emailRes = await fetch(
  //     "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const emailData = await emailRes.json();
  //   const email =
  //     emailData?.elements?.[0]?.["handle~"]?.emailAddress || null;

  //   return NextResponse.json({
  //     accessToken,
  //     profile,
  //     email,
  //   });
  // }

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

        <form className="w-full" onSubmit={loginSubmit(handleLogin)}>
          {/* Login with */}
          <ul className="flex flex-col gap-3">
            {/* Google */}
            <li>
              <button
                type="button"
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
                        hover:bg-slate-100 rounded-lg cursor-pointer"
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
              </button>
            </li>

            {/* Facebook */}
            <li>
              <button
                type="button"
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
                        hover:bg-slate-100 rounded-lg cursor-pointer"
                onClick={loginWithFacebook}
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

            {/* Linked in */}
            <li>
              <button
                type="button"
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
                        hover:bg-slate-100 rounded-lg cursor-pointer"
                onClick={handleSignInWithLinkedIn}
              >
                <FaLinkedin className="w-[18px] h-[18px] text-[#2e78b6]" />
                <span className="font-semibold text-lg">
                  Continue with Linked
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
            className="w-full py-3 bg-primary cursor-pointer text-white font-semibold text-lg rounded-lg"
          >
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
                navigate.push("/signup");
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
