import { AppDispatch, RootState } from "@/src/redux/store";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Image from "next/image";
import defaultImage from "@/app/assets/images/randomUser.jpeg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import MergerPostCard from "@/src/components/merger/MergerPostCard";
import { mergerReset } from "@/src/redux/slices/mergerSlice";
import { useRouter } from "next/navigation";

const Merger_3 = ({ active }: { active: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [primaryPassEye, setPrimaryPassEye] = useState<boolean>(false);
  const UserPosts = [1, 2, 3, 4, 5, 6];

  const mergerActiveStep = useSelector(
    (state: RootState) => state.merger.mergerActiveStep
  );

  const primaryAccData = useSelector(
    (state: RootState) => state.merger.primaryAcc
  );

  const secondaryAccData = useSelector(
    (state: RootState) => state.merger.secondaryAcc
  );

  const handleCloseAction = () => {
    router.replace("/dashboard");
    // dispatch(mergerReset());
  };

  return (
    <div
      className={`flex-1 top-0 left-0 right-0 min-h-full px-16 pt-7 flex flex-col ${
        active
          ? "sticky z-10 overflow-y-auto opacity-100"
          : "absolute -z-10 max-w-0 max-h-0 overflow-hidden opacity-0"
      }`}
    >
      {/* Header */}
      <div className="w-full p-4 border border-slate-400 rounded-md">
        <p className="text-center text-xl font-semibold text-green-700">
          Congratulation, we have merged the accounts successfully.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Check mark */}
        <div className="flex justify-center my-20">
          <FaCheckCircle className="text-7xl text-green-700" />
        </div>

        {/* Accounts List */}
        <div>
          <p className="text-xl font-semibold text-center mb-4">
            We have successfully merged the all data from secondary to primary
            account
          </p>
          <div className="flex justify-center mb-10">
            <div className="rounded-lg py-4 px-10 flex items-center gap-x-4 border border-slate-500">
              <div className="flex items-center gap-3 border border-slate-500 p-4 rounded-lg">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <p className="font-semibold">Primary :</p>
                </div>
                <p>{primaryAccData.email ?? "abc1@gmail.com"}</p>
              </div>
              <div>
                <FaArrowLeftLong className="text-2xl" />
              </div>
              <div className="flex items-center gap-3 border border-slate-500 p-4 rounded-lg">
                <div className="p-2 bg-slate-500 text-white rounded-lg">
                  <p className="font-semibold">Secondary :</p>
                </div>
                <p>{"abc2@gmail.com"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Data */}
        <div>
          <p className="text-xl font-semibold mb-4">
            Summery of merged accounts :
          </p>

          <div>
            {/* Account Profile information */}
            <div className="mb-7">
              <Accordion
                defaultExpanded={false}
                sx={{
                  "&.MuiAccordion-root": {
                    boxShadow: "none",
                    border: "1px solid #62748e",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="Profile Information"
                  id="Profile Information Header"
                  className="font-semibold text-lg"
                >
                  Updated Primary Account Profile Infromation
                </AccordionSummary>
                <AccordionDetails>
                  {/* User photo */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_user_photo_url"
                      control={<Radio defaultChecked />}
                      label={
                        <Image
                          src={defaultImage}
                          width={80}
                          height={80}
                          alt="Primary accouny profile image"
                          className="w-20 h-20 rounded-lg"
                        />
                      }
                      className="w-full m-0!"
                    />
                  </div>

                  {/* Username */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_username"
                      control={<Radio defaultChecked />}
                      label={"Primary Username"}
                      className="w-full m-0!"
                    />
                  </div>

                  {/* User display name  */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_user_display_name"
                      control={<Radio defaultChecked />}
                      label={"Primary User Display Name"}
                      className="w-full m-0!"
                    />
                  </div>

                  {/* User Date of birth */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_user_dob"
                      control={<Radio defaultChecked />}
                      label={"DD/MM/YYYY"}
                      className="w-full m-0!"
                    />
                  </div>

                  {/* User Gender */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_user_gender"
                      control={<Radio defaultChecked />}
                      label={"Female"}
                      className="w-full m-0!"
                    />
                  </div>

                  {/* User Mobile No. */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_user_mobile_no"
                      control={<Radio defaultChecked />}
                      label={"XXXXXX1234"}
                      className="w-full m-0!"
                    />
                  </div>

                  {/* User Passwords */}
                  <div className="w-full mb-4">
                    <FormControlLabel
                      value="primary_user_password"
                      control={<Radio defaultChecked />}
                      label={
                        <div className="relative">
                          <input
                            disabled
                            type={primaryPassEye ? "text" : "password"}
                            className="border border-slate-300 px-3 py-1.5 rounded-sm outline-none disabled:bg-slate-300"
                            value="12345678"
                          />
                          <button
                            type="button"
                            className="absolute w-10 h-full top-1/2 -translate-y-1/2 right-0 cursor-pointer"
                            onClick={(
                              event: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              event.preventDefault();
                              setPrimaryPassEye(!primaryPassEye);
                            }}
                          >
                            {primaryPassEye ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </button>
                        </div>
                      }
                      className="w-full m-0!"
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>

            {/* User Posts */}
            <div className="mb-7">
              <Accordion
                defaultExpanded={false}
                sx={{
                  "&.MuiAccordion-root": {
                    boxShadow: "none",
                    border: "1px solid #62748e",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="Profile Information"
                  id="Profile Information Header"
                  className="font-semibold text-lg"
                >
                  <p className="flex items-center gap-1">
                    Updated Primary Account User Posts
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex flex-col items-center">
                    {/* User Posts */}
                    <ul className="w-full flex flex-col gap-4">
                      {UserPosts &&
                        UserPosts.map((post, inx) => {
                          const key = `userPosts_${inx + 1}`;
                          return (
                            <li
                              key={`post-${inx}`}
                              className="flex items-center"
                            >
                              <p className="w-1/2 font-medium">
                                {inx % 2 == 0
                                  ? "From primary account :"
                                  : "From secondary account :"}
                              </p>
                              <div className="w-1/2">
                                <MergerPostCard
                                  postDate={new Date(Date.now())}
                                  postText={`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`}
                                  postImage={defaultImage}
                                />
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Account Recovery */}
        <div className="border border-slate-500 p-4 rounded-md mb-7">
          <p className="font-semibold text-lg">
            Note: After successful merging, still want to recover all accounts
            and undo merging?
          </p>

          <div className="text-center py-5">
            <button
              type="button"
              className="p-3 bg-primary text-white rounded-lg py-5 font-semibold cursor-pointer"
            >
              Recover All Accounts
            </button>
          </div>

          <p className="text-green-700">
            Please note after merging the account you can recover the all
            account and undo the merger within 15 days after that we can not
            recover the any account.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-14 py-5 border-t border-t-slate-300 text-center">
        <button
          type="button"
          className="min-w-[90px] py-1.5 bg-red-700 rounded-sm text-white font-medium cursor-pointer"
          onClick={handleCloseAction}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Merger_3;
