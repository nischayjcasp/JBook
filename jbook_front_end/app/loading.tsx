import { CircularProgress } from "@mui/material";
import Image from "next/image";
import jbookLogo from "@/app/favicon.ico";

const MainLoader = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen z-1500 bg-white flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        {/* JBook Logo */}
        <div className="flex items-end">
          <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
          <span className="font-medium text-3xl leading-none">Book</span>
        </div>
        <CircularProgress
          size="30px"
          sx={{
            "&.MuiCircularProgress-root": {
              color: "#e1533c",
            },
          }}
        />
      </div>
    </div>
  );
};

export default MainLoader;
