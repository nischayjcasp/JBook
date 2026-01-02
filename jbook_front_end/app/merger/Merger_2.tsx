import { AppDispatch, ReduxStore, RootState } from "@/redux/store";
import {
  mergerNext,
  mergerPrev,
  mergeSuccess,
  startMerging,
  stopMerging,
  updateMergingProcess,
} from "@/redux/slices/mergerSlice";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import defaultImage from "@/app/assets/images/randomUser.jpeg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRef, useState } from "react";
import MergerPostCard from "@/components/merger/MergerPostCard";

const Merger_2 = ({ active }: { active: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [primaryPassEye, setPrimaryPassEye] = useState<boolean>(false);
  const [secondaryPassEye, setSecondaryPassEye] = useState<boolean>(false);
  const mergerActiveStep = useSelector(
    (state: RootState) => state.merger.mergerActiveStep
  );
  const primaryAccData = useSelector(
    (state: RootState) => state.merger.primaryAcc
  );
  const secondaryAccData = useSelector(
    (state: RootState) => state.merger.secondaryAcc
  );
  const [accProfilExpand, setAccProfilExpand] = useState<boolean>(true);
  const [userPostsExpand, setUserPostsExpand] = useState<boolean>(true);

  const handleBackAction = () => {
    dispatch(mergerPrev());
  };

  const handleNextStep = () => {
    setAccProfilExpand(true);
    setUserPostsExpand(true);
    mergeSubmit(handleMergerSubmit)();
  };

  const {
    control: mergeControl,
    handleSubmit: mergeSubmit,
    clearErrors: mergeClearErrors,
    formState: { errors: mergeErrors },
  } = useForm();

  const handleMergerSubmit = (data: any) => {
    console.log("Data", data);
    // dispatch(mergerNext());
    router.push("/dashboard");
    dispatch(startMerging({ mergedPost: 0, totalPost: 100 }));

    const mergingInterval = setInterval(() => {
      const MergedPosts =
        ReduxStore.getState().merger.mergingProgress.mergedPost;
      const TotalPosts = ReduxStore.getState().merger.mergingProgress.totalPost;

      console.log("Interval is running..", MergedPosts, TotalPosts);

      if (MergedPosts < TotalPosts) {
        dispatch(updateMergingProcess({ mergedPost: 10 }));
      } else {
        clearInterval(mergingInterval);
        dispatch(
          stopMerging({ mergedPost: MergedPosts, totalPost: TotalPosts })
        );
        router.push("/merger");
        dispatch(mergeSuccess());
      }
    }, 1000);
  };

  const UserPosts = [1, 2, 3, 4, 5, 6];

  return (
    <div
      className={`flex-1 top-0 left-0 right-0 min-h-full flex flex-col ${
        active
          ? "sticky z-10 overflow-y-auto opacity-100"
          : "absolute -z-10 max-w-0 max-h-0 overflow-hidden opacity-0"
      }`}
    >
      {/* Header */}
      <div className="mt-7 mb-10">
        <p className="text-[26px] font-semibold text-center">
          Step 2 - Comparing the Data
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Accounts List */}
        <div className="flex justify-center mb-10">
          <div className="rounded-lg py-4 px-10 flex items-center gap-x-4 border border-slate-500">
            <div className="flex items-center gap-3 border border-slate-500 p-4 rounded-lg">
              <div className="bg-primary text-white p-2 rounded-lg">
                <p className="font-semibold">Primary :</p>
              </div>
              <p>{primaryAccData.email ?? " "}</p>
            </div>
            <div>
              <FaArrowLeftLong className="text-2xl" />
            </div>
            <div className="flex items-center gap-3 border border-slate-500 p-4 rounded-lg">
              <div className="p-2 bg-slate-500 text-white rounded-lg">
                <p className="font-semibold">Secondary :</p>
              </div>
              <p>{secondaryAccData.email ?? " "}</p>
            </div>
          </div>
        </div>

        {/* Data Selection */}
        <form
          className="w-full flex flex-col px-16"
          onSubmit={mergeSubmit(handleMergerSubmit)}
        >
          {/* Account Profile information */}
          <div className="mb-7">
            <Accordion
              expanded={accProfilExpand}
              onChange={() => setAccProfilExpand(!accProfilExpand)}
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
                Profile Information
              </AccordionSummary>
              <AccordionDetails>
                {/* Primary Account Info */}
                <div className="w-full flex py-3 mb-3">
                  <p className="w-1/2 text-center font-semibold">
                    Primary&nbsp;
                    <span className="font-normal text-slate-500">
                      ({primaryAccData.email ?? " "})
                    </span>
                  </p>
                  <p className="w-1/2 text-center font-semibold">
                    Secondary&nbsp;
                    <span className="font-normal text-slate-500">
                      ({secondaryAccData.email ?? " "})
                    </span>
                  </p>
                </div>

                {/* User photo */}
                <div className="w-full mb-4">
                  <Controller
                    name="userPhoto"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user photo!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_user_photo_url"
                            control={<Radio />}
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
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondory_user_photo_url"
                            control={<Radio />}
                            label={
                              <Image
                                src={defaultImage}
                                width={100}
                                height={100}
                                alt="Primary accouny profile image"
                                className="w-20 h-20 rounded-lg"
                              />
                            }
                            className="w-full m-0!"
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userPhoto && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userPhoto.message as string}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="w-full mb-4">
                  <Controller
                    name="userName"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user username!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_username"
                            control={<Radio />}
                            label={"Primary Username"}
                            className="w-full m-0!"
                          />
                        </div>
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondary_username"
                            control={<Radio />}
                            label={"Secondary Username"}
                            className="w-full m-0!"
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userName && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userName.message as string}
                    </p>
                  )}
                </div>

                {/* User display name  */}
                <div className="w-full mb-4">
                  <Controller
                    name="userDisplayName"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user display name!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_user_display_name"
                            control={<Radio />}
                            label={"Primary User Display Name"}
                            className="w-full m-0!"
                          />
                        </div>
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondary_user_display_name"
                            control={<Radio />}
                            label={"Primary User Display Name"}
                            className="w-full m-0!"
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userName && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userName.message as string}
                    </p>
                  )}
                </div>

                {/* User Date of birth */}
                <div className="w-full mb-4">
                  <Controller
                    name="userDob"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user date of birth!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_user_dob"
                            control={<Radio />}
                            label={"DD/MM/YYYY"}
                            className="w-full m-0!"
                          />
                        </div>
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondary_user_dob"
                            control={<Radio />}
                            label={"DD/MM/YYYY"}
                            className="w-full m-0!"
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userDob && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userDob.message as string}
                    </p>
                  )}
                </div>

                {/* User Gender */}
                <div className="w-full mb-4">
                  <Controller
                    name="userGender"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user gender!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_user_gender"
                            control={<Radio />}
                            label={"Female"}
                            className="w-full m-0!"
                          />
                        </div>
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondary_user_gender"
                            control={<Radio />}
                            label={"Male"}
                            className="w-full m-0!"
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userGender && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userGender.message as string}
                    </p>
                  )}
                </div>

                {/* User Mobile No. */}
                <div className="w-full mb-4">
                  <Controller
                    name="userMobileNo"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user mobile no.!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_user_mobile_no"
                            control={<Radio />}
                            label={"XXXXXX1234"}
                            className="w-full m-0!"
                          />
                        </div>
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondary_user_mobile_no"
                            control={<Radio />}
                            label={"XXXXXX1234"}
                            className="w-full m-0!"
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userMobileNo && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userMobileNo.message as string}
                    </p>
                  )}
                </div>

                {/* User Passwords */}
                <div className="w-full mb-4">
                  <Controller
                    name="userPassword"
                    control={mergeControl}
                    rules={{
                      required: {
                        value: true,
                        message: "Please selected user password!",
                      },
                    }}
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        row
                        name={name}
                        value={value ?? null}
                        onChange={onChange}
                      >
                        <div className="w-1/2">
                          <FormControlLabel
                            value="primary_user_password"
                            control={<Radio />}
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
                        <div className="w-1/2">
                          <FormControlLabel
                            value="secondary_user_password"
                            control={<Radio />}
                            label={
                              <div className="relative">
                                <input
                                  disabled
                                  type={secondaryPassEye ? "text" : "password"}
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
                                    setSecondaryPassEye(!secondaryPassEye);
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
                      </RadioGroup>
                    )}
                  />

                  {mergeErrors.userPassword && (
                    <p className="text-red-500 text-sm ps-[42px] mt-2">
                      {mergeErrors.userPassword.message as string}
                    </p>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* User Posts (with conflicts) */}
          <div className="mb-7">
            <Accordion
              expanded={userPostsExpand}
              onChange={() => setUserPostsExpand(!userPostsExpand)}
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
                  <span>User Posts</span>
                  <span className="text-red-600">(with conflicts)</span>
                </p>
              </AccordionSummary>
              <AccordionDetails>
                <div className="w-full flex flex-col">
                  {/* Primary Account Info */}
                  <div className="w-full flex py-3 mb-3">
                    <p className="w-1/2 text-center font-semibold">
                      Primary&nbsp;
                      <span className="font-normal text-slate-500">
                        ({primaryAccData.email ?? " "})
                      </span>
                    </p>
                    <p className="w-1/2 text-center font-semibold">
                      Secondary&nbsp;
                      <span className="font-normal text-slate-500">
                        ({secondaryAccData.email ?? " "})
                      </span>
                    </p>
                  </div>

                  {/* User Posts */}
                  <ul>
                    {UserPosts &&
                      UserPosts.map((post, inx) => {
                        const key = `userPosts_${inx + 1}`;
                        return (
                          <li key={`post-${inx}`}>
                            <div className="w-full mb-4">
                              <Controller
                                name={key}
                                control={mergeControl}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Please selected the post!",
                                  },
                                }}
                                render={({
                                  field: { onChange, value, name },
                                }) => (
                                  <div>
                                    <RadioGroup
                                      row
                                      name={name}
                                      value={value ?? null}
                                      onChange={onChange}
                                    >
                                      <div className="w-full flex gap-5">
                                        <div className="w-1/2">
                                          <FormControlLabel
                                            value={`primary_post_id_${inx}`}
                                            control={<Radio />}
                                            label={
                                              <MergerPostCard
                                                postDate={new Date(Date.now())}
                                                postText={`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`}
                                                postImage={defaultImage}
                                              />
                                            }
                                            className="w-full m-0!"
                                            sx={{
                                              "& .MuiTypography-root": {
                                                width: "100%",
                                              },
                                            }}
                                          />
                                        </div>
                                        <div className="w-1/2">
                                          <FormControlLabel
                                            value={`secondary_post_id_${inx}`}
                                            control={<Radio />}
                                            label={
                                              <MergerPostCard
                                                postDate={new Date(Date.now())}
                                                postText={`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`}
                                                postImage={defaultImage}
                                              />
                                            }
                                            className="w-full m-0!"
                                          />
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                )}
                              />
                              {mergeErrors[key] && (
                                <p className="text-red-500 text-sm ps-[42px] mt-2">
                                  {mergeErrors[key].message as string}
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </form>

        {/* Posts without conflicts */}
        <div className="mb-7 px-16">
          <Accordion
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
                <span>User Posts</span>
                <span className="text-green-600">(without conflicts)</span>
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
                        <li key={`post-${inx}`} className="flex items-center">
                          <p className="w-1/2 font-medium flex gap-2">
                            {inx % 2 == 0 ? (
                              <>
                                <span>From primary account</span>
                                <span className="font-normal text-slate-500">
                                  ({primaryAccData.email ?? " "})
                                </span>
                              </>
                            ) : (
                              <>
                                <span>From secondary account</span>
                                <span className="font-normal text-slate-500">
                                  ({secondaryAccData.email ?? " "})
                                </span>
                              </>
                            )}
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

      {/* Footer */}
      <div className="px-14 py-5 border-t border-t-slate-300 flex items-center justify-between">
        <button
          type="button"
          className="min-w-[90px] py-1.5 bg-red-700 rounded-sm text-white font-medium cursor-pointer"
          onClick={handleBackAction}
        >
          {mergerActiveStep == 1 ? "Cancel" : "Back"}
        </button>

        <button
          type="button"
          className="min-w-[90px] py-1.5 bg-blue-700 rounded-sm text-white font-medium cursor-pointer"
          onClick={handleNextStep}
        >
          Merge
        </button>
      </div>
    </div>
  );
};

export default Merger_2;
