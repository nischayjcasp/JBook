"use client";

import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";
import jcaspLogo from "@/app/assets/logos/imgi_4_JCasp-logo-homepage.svg";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import SignUpForm from "../../components/auth/SignUpForm";

const Auth = () => {
  const [authState, setAuthState] = useState<"login" | "signup">("login");
  return (
    <div className="w-full h-full max-h-screen flex overflow-hidden">
      {/* Login Form */}
      {authState == "login" && <LoginForm auth={{ authState, setAuthState }} />}

      {/* Sign Up Form */}
      {authState == "signup" && (
        <SignUpForm auth={{ authState, setAuthState }} />
      )}

      {/* Cover Slide */}
      <div
        className={`fixed top-0 bottom-0 w-1/2 p-5 hidden md:flex flex-col justify-center items-center bg-[#1C2A39] z-10 border border-slate-200 transition-transform duration-200 ${
          authState == "signup"
            ? "translate-x-0 rounded-se-4xl rounded-ee-4xl"
            : "translate-x-full rounded-es-4xl rounded-ss-4xl"
        }
      `}
      >
        {/* JBook Logo */}
        <div className="flex items-end mb-14">
          <Image src={jcaspLogo} alt="JBook logo" className="max-h-[100px]" />
        </div>

        <div className="text-white text-xl flex flex-col items-center xl:items-start">
          <p className="flex gap-2 mb-2">
            <FaQuoteLeft className="text-sm" />
            <span>Craft your perfect day.</span>
          </p>
          <div className="flex flex-col xl:flex-row items-center gap-1">
            <div className="flex items-end gap-1">
              <Image src={jbookLogo} alt="JBook logo" className="w-7 h-7" />
              <p className="font-medium text-xl">
                Book keeps your tasks simple
              </p>
            </div>
            <p className="flex flex-nowrap gap-2">
              <span>and your goals clear.</span>
              <FaQuoteRight className="text-sm" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
