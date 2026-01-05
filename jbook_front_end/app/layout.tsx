"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Slide, ToastContainer } from "react-toastify";
import Script from "next/script";
import { Provider, useSelector } from "react-redux";
import { ReduxStore, RootState } from "@/redux/store";
import MainLoaderWrapper from "@/components/loaders/MainLoaderWrapper";
import BackgrounProcess from "@/components/merger/BackgrounProcess";

// export const metadata: Metadata = {
//   title: "JBook | Jcasp Technologies",
//   description: "JBook a Task management App",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        {/* React Toast */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
          transition={Slide}
        />

        {/* Load Google Identity Services */}
        <Script
          src="https://accounts.google.com/gsi/client"
          // strategy="afterInteractive"
          strategy="beforeInteractive"
        />

        {/* Facebook login script */}
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          strategy="afterInteractive"
          onLoad={() => {
            window.FB.init({
              appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
              cookie: true,
              xfbml: false,
              version: "v21.0",
            });
          }}
        />

        {/* Redux provider */}
        <Provider store={ReduxStore}>
          <MainLoaderWrapper>{children}</MainLoaderWrapper>
        </Provider>
      </body>
    </html>
  );
}
