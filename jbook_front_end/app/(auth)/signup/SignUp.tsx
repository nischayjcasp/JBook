"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import googleLogo from "@/app/assets/logos/google_logo.svg";
import facebookLogo from "@/app/assets/logos/fb_logo.svg";
import {
  FaArrowRight,
  FaLinkedin,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useRef, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema, SignupSchemaType } from "@/lib/schemas/auth.schema";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Avatar, CircularProgress, Dialog } from "@mui/material";
import { GoArrowRight } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import {
  EmailSignupPayloadType,
  FacebookSignupPayload,
  GoogleSignupPayload,
} from "@/services/auth.type";
import {
  emailSingupAPI,
  facebookSingupAPI,
  getDeivceIpAPI,
  googleSingupAPI,
  linkedInSingupAPI,
} from "@/services/auth.service";
import { DeviceId, DeviceLocation } from "@/util/common.util";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signUpPassEye, setSignUpPassEye] = useState<boolean>(false);
  const [signUpCPassEye, setSignUpCPassEye] = useState<boolean>(false);
  const [alreadyHaveAccount, setAlreadyHaveAccount] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [isLoadingFacebook, setLoadingFacebook] = useState<boolean>(false);
  const [isLoadingLinkedIn, setLoadingLinkedIn] = useState<boolean>(false);
  const randomNum = Math.floor(Math.random() * 10000);
  let isSignupDone = useRef<boolean>(false);

  const params = useSearchParams();
  const linkendInCode = params.get("code");
  const linkendInCallback = params.get("callback");

  useEffect(() => {
    const handleLinkedSignup = async (code: string) => {
      setLoadingLinkedIn(true);
      try {
        //Sign up payload
        const deviceIpRes = await getDeivceIpAPI();
        const deviceIp = await DeviceLocation();

        const payload: GoogleSignupPayload = {
          authCode: code,
          user_agent: navigator.userAgent,
          device_ip: deviceIpRes.data?.ip ?? null,
          device_lat: deviceIp.lat,
          device_long: deviceIp.long,
        };

        const linkedInSignupRes = await linkedInSingupAPI(payload);

        console.log("linkedInSignupRes: ", linkedInSignupRes);

        if (linkedInSignupRes.status === 201) {
          toast.success(linkedInSignupRes.message);
          router.replace("/dashboard");
          setLoadingLinkedIn(false);
        } else {
          toast.error(linkedInSignupRes.message);
        }
      } catch (error) {
        console.log("Error: ", error);
        let err = error as { message: string };
        toast.error(err.message);
        redirect("/signup");
      } finally {
        isSignupDone.current = false;
        setLoadingLinkedIn(false);
      }
    };

    if (!isSignupDone.current && linkendInCode && linkendInCallback) {
      isSignupDone.current = true;
      console.log("linkendInCode: ", linkendInCode);
      handleLinkedSignup(linkendInCode);
    }
  }, []);

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
      signup_username: `ram`,
      signup_dob: new Date("2011-05-25"),
      signup_gender: "male",
      signup_mobile: "8141409448",
      signup_email: `ram${randomNum}@gmail.com`,
      signup_password: `Ram@@${randomNum}`,
      signup_cpassword: `Ram@@${randomNum}`,
    },
  });

  const handleEmailSignUp = async (data: SignupSchemaType) => {
    console.log(data);
    setLoading(true);

    //Sign up payload
    const deviceIpRes = await getDeivceIpAPI();
    const deviceIp = await DeviceLocation();

    console.log("deviceIpResp: ", deviceIp);

    try {
      const payload: EmailSignupPayloadType = {
        signup_username: data.signup_username,
        signup_dob: data.signup_dob,
        signup_gender: data.signup_gender,
        signup_mobile: data.signup_mobile,
        signup_email: data.signup_email,
        signup_password: data.signup_password,
        user_agent: navigator.userAgent,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };

      const emailSignupRes = await emailSingupAPI(payload);

      console.log("emailLoginRes: ", emailSignupRes);

      if (emailSignupRes.status === 201) {
        signupReset();
        toast.success(emailSignupRes.message);
        router.replace("/dashboard");
      } else {
        toast.error(emailSignupRes.message);
      }
    } catch (error: unknown) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Sign up with google: Front-end
  const [googleClient, setGoogleClient] = useState<any>(null);

  useEffect(() => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        callback: handleGoogleSignupCallback,
      });

      setGoogleClient(client);
    }
  }, []);

  const handleGoogleSignupCallback = async (response: any) => {
    console.log("Code: ", response.code);
    setLoadingGoogle(true);
    try {
      //Sign up payload
      const deviceIpRes = await getDeivceIpAPI();
      const deviceIp = await DeviceLocation();

      const payload: GoogleSignupPayload = {
        authCode: response.code,
        user_agent: navigator.userAgent,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };

      const googleSignupRes = await googleSingupAPI(payload);

      console.log("googleSignupRes: ", googleSignupRes);

      if (googleSignupRes.status === 201) {
        toast.success(googleSignupRes.message);
        router.replace("/dashboard");
        setLoadingGoogle(false);
      } else {
        toast.error(googleSignupRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGoogleSignup = () => {
    if (!googleClient) return;
    googleClient.requestCode();
  };

  // Sign up with Facebook
  const handleFacebookSignup = () => {
    window.FB.login(
      function (response: any) {
        console.log("response: ", response);
        if (response.authResponse && response.authResponse.accessToken) {
          facebookSignupCallback(response.authResponse);
        } else {
          console.log("User cancelled login");
          toast.error("Failed to sign up with facebook");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  const facebookSignupCallback = async (authResp: any) => {
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
      const device_id: string = DeviceId();
      const deviceIpRes = await getDeivceIpAPI();
      const deviceIp = await DeviceLocation();

      const payload: FacebookSignupPayload = {
        access_token: authResp.accessToken,
        user_agent: navigator.userAgent,
        device_ip: deviceIpRes.data?.ip ?? null,
        device_lat: deviceIp.lat,
        device_long: deviceIp.long,
      };

      const facebookSignupRes = await facebookSingupAPI(payload);

      console.log("facebookSignupRes: ", facebookSignupRes);

      if (facebookSignupRes.status === 201) {
        toast.success(facebookSignupRes.message);
        router.replace("/dashboard");
        setLoadingFacebook(false);
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

  // Sign up with linked in
  const handleSignInWithLinkedIn = () => {
    const linkedUrlParameters = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_LINKED_IN_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_SINGUP_REDIRECT_URI!,
      scope: "openid profile email",
    });

    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${linkedUrlParameters}`;
  };

  const closeAlreadyHaveAccDialog = () => {
    setAlreadyHaveAccount(false);
  };

  const handleOneClickLogin = () => {
    closeAlreadyHaveAccDialog();
    console.log("One click login");

    toast.success("You have logged in successfully.");
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

        <form className="w-full" onSubmit={signupSubmit(handleEmailSignUp)}>
          {/* Sign up with */}
          <ul className="flex flex-col gap-3">
            {/* Google */}
            <li>
              <button
                type="button"
                disabled={isLoadingGoogle}
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
              hover:bg-slate-100 rounded-lg cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                onClick={handleGoogleSignup}
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
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
              hover:bg-slate-100 rounded-lg cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                onClick={handleFacebookSignup}
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

            {/* Linked In */}
            <li>
              <button
                type="button"
                disabled={isLoadingLinkedIn}
                className="w-full py-3 flex justify-center items-center gap-3 border border-slate-200  hover:border-slate-300 bg-white
              hover:bg-slate-100 rounded-lg cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                onClick={handleSignInWithLinkedIn}
              >
                <FaLinkedin className="w-[18px] h-[18px] text-[#2e78b6]" />
                <span className="font-semibold text-lg">
                  Continue with LinkedIn
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

          {/* Username */}
          <div className="mb-2.5">
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
          <div className="mb-2.5">
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
          <div className="mb-2.5">
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

          {/* Mobile number */}
          <div className="mb-2.5">
            <Controller
              name="signup_mobile"
              control={signupControl}
              render={({ field: { value, onChange, name } }) => (
                <TextField
                  label="Mobile No."
                  placeholder="Enter mobile "
                  name={name}
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  className="w-full"
                  error={signupErrors.signup_mobile?.message ? true : false}
                  helperText={
                    signupErrors.signup_mobile?.message
                      ? `${signupErrors.signup_mobile.message}`
                      : " "
                  }
                />
              )}
            />
          </div>

          {/* Email */}
          <div className="mb-2.5">
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
          <div className="mb-2.5">
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
          <div className="mb-2.5">
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
            Sign up with Email
          </button>

          <hr className="my-4 w-full h-px border-none bg-slate-200" />
          <p className="my-4 flex justify-center items-center gap-3">
            <span className="text-sm">Already have account ?</span>
            <button
              type="button"
              className="font-medium underline text-primary cursor-pointer"
              onClick={() => {
                router.push("/login");
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

      {/* Already have account dialog */}
      <Dialog
        open={alreadyHaveAccount}
        onClose={closeAlreadyHaveAccDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
          },
        }}
      >
        <div className="py-10 px-18 w-md bg-white h-[calc(100vh-32px)] max-h-[calc(100vh-32px)]">
          <button
            type="button"
            className="absolute top-4 right-4 p-1.5 bg-slate-300 rounded-full cursor-pointer"
            onClick={closeAlreadyHaveAccDialog}
          >
            <IoMdClose className="text-xl" />
          </button>
          <p className="text-2xl font-semibold text-center mb-4">
            Choose a account to continue
          </p>
          <p className="text-sm text-center">
            your email <b>{"abc@gmail.com"}</b> is connected to :
          </p>
          <ul className="py-5 flex flex-col items-center">
            <li className="w-full">
              <button
                type="button"
                className="w-full flex justify-between items-center cursor-pointer p-4 border-b border-b-slate-300"
                onClick={handleOneClickLogin}
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    alt="Username"
                    src={"/userDefaultPic.jpg"}
                    sx={{ width: 30, height: 30 }}
                  />
                  <p className="text-sm">User name</p>
                </div>
                <p className="p-1.5">
                  <GoArrowRight className="text-xl" />
                </p>
              </button>
            </li>
          </ul>
        </div>
      </Dialog>
    </div>
  );
};

export default SignUp;
