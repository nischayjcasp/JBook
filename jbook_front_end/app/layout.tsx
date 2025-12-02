import type { Metadata } from "next";
import "./globals.css";
import { Slide, ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "JBook | Jcasp Technologies",
  description: "JBook a Task management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <ToastContainer
          position="top-center"
          autoClose={5000}
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
        {children}
      </body>
    </html>
  );
}
