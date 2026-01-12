import EmailVerifyTimer from "@/components/merger/EmailVerifyTimer";
import { AppDispatch, ReduxStore, RootState } from "@/redux/store";
import {
  mergerNext,
  setPrimaryAccData,
  setSecondaryAccData,
} from "@/redux/slices/mergerSlice";
import {
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserByIdAPI, fetchUserData } from "@/services/user.serivce";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  OtpVerificationSchema,
  OtpVerificationType,
} from "@/lib/schemas/auth.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FotgotPasswordPayload } from "@/services/auth.type";
import {
  otpVerifyAPI,
  resendOtpAPI,
  sentOtpAPI,
} from "@/services/auth.service";
import { OtpInput } from "reactjs-otp-input";
import OtpTimer from "@/components/auth/OtpTimer";
import { mergerInitialLog } from "@/services/merger.service";

export interface SelectedAccType {
  userId: string;
  emailId: string | null;
  isVerified: boolean;
  startTimer: boolean;
  isExpired: boolean;
  isPrimary: boolean;
}

const Merger_1 = ({ active }: { active: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [instrucDialog, setInstrucDialog] = useState(false);
  const [otpDialog, setOtpDialog] = useState<{
    status: boolean;
    email_id: string;
    user_id: string;
    otp_id: string;
  }>({
    status: false,
    email_id: "",
    user_id: "",
    otp_id: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAllVerified, setIsAllVerified] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);

  const PrimaryAccData = useSelector(
    (state: RootState) => state.merger.primaryAcc.primaryUser
  );
  const SeconadaryAccData = useSelector(
    (state: RootState) => state.merger.secondaryAcc.secondaryUser
  );

  const [errors, setErrors] = useState<string | null>(null);

  const [selectedAcc, setSelectedAcc] = useState<SelectedAccType[]>([]);

  const mergerActiveStep = useSelector(
    (state: RootState) => state.merger.mergerActiveStep
  );

  const openInstrucDialog = () => {
    setInstrucDialog(true);
  };

  const closeInstrucDialog = () => {
    setInstrucDialog(false);
  };

  const openOtpDialog = (user_id: string, email_id: string, otp_id: string) => {
    setOtpDialog({
      status: true,
      email_id,
      user_id,
      otp_id,
    });
  };

  const closeOtpDialog = () => {
    setOtpDialog({
      status: false,
      email_id: "",
      user_id: "",
      otp_id: "",
    });

    otpReset();
    setIsTimerRunning(false);
    setIsOtpExpired(false);
  };

  // Setting the accounts list
  useEffect(() => {
    if (PrimaryAccData && SeconadaryAccData) {
      openInstrucDialog();

      setSelectedAcc([
        {
          userId: PrimaryAccData.userId,
          emailId: PrimaryAccData.userEmail,
          isVerified: true,
          startTimer: false,
          isPrimary: true,
          isExpired: false,
        },
        {
          userId: SeconadaryAccData.userId,
          emailId: SeconadaryAccData.userEmail,
          isVerified: true,
          startTimer: false,
          isPrimary: false,
          isExpired: false,
        },
      ]);
    } else {
      router.replace("/dashboard");
    }
  }, []);

  // User consent form
  const {
    control: userConsentControl,
    handleSubmit: userConsentSubmit,
    formState: { errors: userConsentErrors },
  } = useForm({
    defaultValues: {
      merger_user_content: false,
    },
  });

  const handleUserConsent = async (data: any) => {
    console.log("user consent:", data);
    closeInstrucDialog();
    // try {
    //   const startMergerLog = await mergerInitialLog();
    // } catch (error) {
    //   console.log("Error: ", error);
    //   let err = error as { message: string };
    //   toast.error(err.message);
    // }
  };

  const handleBackAction = () => {
    router.replace("/dashboard");
  };

  //Primary Account selection form
  const {
    control: primaryAccControl,
    watch: primaryAccWatch,
    handleSubmit: primaryAccSubmit,
    setError: primaryAccSetError,
    formState: { errors: primaryAccErrors },
  } = useForm({
    defaultValues: {
      primary_account: PrimaryAccData?.userId,
    },
  });

  const PrimaryAcc = primaryAccWatch("primary_account");

  useEffect(() => {
    console.log("PrimaryAcc: ", PrimaryAcc);
    selectedAcc.forEach((acc) => {
      acc.isPrimary = false;
    });
    const selectedAccInx = selectedAcc.findIndex(
      (acc) => acc.userId === PrimaryAcc
    );
    if (selectedAccInx != -1) {
      selectedAcc[selectedAccInx].isPrimary = true;
      setSelectedAcc([...selectedAcc]);
    }
  }, [PrimaryAcc]);

  const handleNextStep = async (data: any) => {
    console.log("data: ", data);

    try {
      // Validate accounts
      for (let i = 0; i < selectedAcc.length; i++) {
        if (!selectedAcc[i].isVerified) {
          setErrors(`Please verify account: ${selectedAcc[i].emailId}`);
          return;
        }
      }

      setIsLoading(true);
      setIsAllVerified(true);

      // Fetch primary users data
      const fetchPrimaryUser = await fetchUserByIdAPI(data.primary_account);

      console.log("fetchPrimaryUser:", fetchPrimaryUser);

      if (fetchPrimaryUser && fetchPrimaryUser.status === 200) {
        dispatch(
          setPrimaryAccData({
            primaryUser: {
              userId: fetchPrimaryUser.user.user_id,
              userName: fetchPrimaryUser.user.username,
              userDisplayName: fetchPrimaryUser.user.display_name,
              userDob: fetchPrimaryUser.user.dob,
              userGender: fetchPrimaryUser.user.gender,
              userEmail: fetchPrimaryUser.user.email,
              password: fetchPrimaryUser.user.password,
              userPhoto: fetchPrimaryUser.user.profile_photo,
              conncetedAcc: [],
            },
            isVerified: true,
          })
        );
      } else {
        throw new Error(fetchPrimaryUser.message);
      }

      // Fetch secondary users data
      const secondaryUserInx = selectedAcc.findIndex(
        (acc) => acc.userId !== data.primary_account
      );

      const fetchSecondaryUser = await fetchUserByIdAPI(
        selectedAcc[secondaryUserInx].userId
      );

      console.log("fetchSecondaryUser:", fetchSecondaryUser);

      if (fetchSecondaryUser && fetchSecondaryUser.status === 200) {
        dispatch(
          setSecondaryAccData({
            secondaryUser: {
              userId: fetchSecondaryUser.user.user_id,
              userName: fetchSecondaryUser.user.username,
              userDisplayName: fetchSecondaryUser.user.display_name,
              userDob: fetchSecondaryUser.user.dob,
              userGender: fetchSecondaryUser.user.gender,
              userEmail: fetchSecondaryUser.user.email,
              password: fetchSecondaryUser.user.password,
              userPhoto: fetchSecondaryUser.user.profile_photo,
              conncetedAcc: [],
            },
            isVerified: true,
          })
        );
      } else {
        throw new Error(fetchSecondaryUser.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }

    toast.success("Merger Step 1 completed!");

    dispatch(mergerNext());
  };

  // <============================ Account verification ============================>

  // Forgot password Form
  const {
    handleSubmit: otpSubmit,
    control: otpControl,
    reset: otpReset,
    setError: otpSetError,
    formState: { errors: otpErrors },
  } = useForm<OtpVerificationType>({
    resolver: yupResolver(OtpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (isOtpExpired) {
      toast.warn("OTP is expired!");
    }
  }, [isOtpExpired]);

  const sentVerificationOTP = async (user_id: string, email_id: string) => {
    console.log("user_id: ", user_id);
    console.log("email_id: ", email_id);
    setOtpDialog({
      status: false,
      user_id,
      email_id,
      otp_id: "",
    });

    setIsLoading(true);

    try {
      const sentOtpRes = await sentOtpAPI(user_id);

      console.log("sentOtpRes: ", sentOtpRes);

      if (sentOtpRes.status === 200 && sentOtpRes.otp_id) {
        openOtpDialog(user_id, email_id, sentOtpRes.otp_id);
        toast.success(sentOtpRes.message);
        setIsTimerRunning(true);
      } else {
        toast.error(sentOtpRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (data: OtpVerificationType) => {
    console.log("Data: ", data);
    setIsLoading(true);

    try {
      //OTP up payload
      const payload: Partial<FotgotPasswordPayload> = {
        otp_id: otpDialog.otp_id,
        otp: data.otp,
      };

      const otpVerifyRes = await otpVerifyAPI(payload);

      console.log("otpVerifyRes: ", otpVerifyRes);

      if (otpVerifyRes.status === 200) {
        toast.success(otpVerifyRes.message);

        console.log("handleOtpVerification-user_id: ", otpDialog.user_id);
        console.log("handleOtpVerification-email_id: ", otpDialog.email_id);

        const findAccInx = selectedAcc.findIndex(
          (acc) => acc.userId === otpDialog.user_id
        );

        selectedAcc[findAccInx].isVerified = true;

        console.log("selectedAcc: ", selectedAcc);

        setSelectedAcc([...selectedAcc]);

        closeOtpDialog();
      } else {
        toast.error(otpVerifyRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Main Page content */}
      <div
        className={`px-16 flex-1 top-0 left-0 right-0 flex flex-col ${
          active
            ? "sticky z-10 min-h-full overflow-y-auto opacity-100"
            : "absolute -z-10 max-w-0 max-h-0 overflow-hidden opacity-0"
        }`}
      >
        {/* Header */}
        <div className="mt-7 mb-10">
          <p className="text-[26px] font-semibold text-center">
            Step 1 - Choose primary Account & Verify secondary account
          </p>
        </div>

        <form
          className="flex-1 flex flex-col"
          onSubmit={primaryAccSubmit(handleNextStep)}
        >
          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto flex flex-col">
            <p className="font-semibold mb-1">
              We are merging the accounts as listed below, please choose primary
              account
            </p>

            <Controller
              name="primary_account"
              control={primaryAccControl}
              rules={{
                required: {
                  value: true,
                  message: "Please select primary account !",
                },
              }}
              render={({ field: { onChange, name, value } }) => (
                <RadioGroup
                  name={name}
                  value={value ?? null}
                  onChange={onChange}
                >
                  <table className="w-full max-h-[500px] overflow-y-auto">
                    <tbody>
                      {selectedAcc &&
                        selectedAcc.map((acc, inx) => (
                          <tr key={`account-${inx}`}>
                            {/* Email */}
                            <td className="p-1.5 w-1/2">
                              <FormControlLabel
                                value={acc.userId}
                                disabled={isLoading}
                                control={
                                  <Radio
                                    value={acc.userId}
                                    checked={acc.isPrimary}
                                  />
                                }
                                label={acc.emailId}
                                className="w-full"
                              />
                            </td>

                            {/* Verified badge */}
                            <td className="p-1.5">
                              <div className="w-full text-center">
                                {acc.isVerified ? (
                                  <button
                                    type="button"
                                    className="w-[90px] mx-auto flex items-center gap-1 text-sm bg-green-600/90 hover:bg-green-600 text-white px-1.5 py-1 rounded-sm"
                                  >
                                    <IoShieldCheckmarkSharp className="text-lg" />
                                    <span>Verified</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={acc.startTimer}
                                    className="flex justify-center items-center gap-1 text-sm bg-red-600 text-white px-1.5 py-1 rounded-sm"
                                  >
                                    <RiErrorWarningLine className="text-xl" />
                                    <span>Unverified</span>
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Primary/Secondary */}
                            <td className="p-1.5 min-w-[100px]">
                              {acc.isPrimary ? (
                                <p className="text-center text-blue-700">
                                  Primary
                                </p>
                              ) : (
                                <p className="text-center text-slate-500">
                                  Secondary
                                </p>
                              )}
                            </td>

                            <td className="">
                              {!acc.isVerified && (
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  className="min-w-[90px] mx-auto text-center text-sm bg-primary/90 hover:bg-primary text-white px-1.5 py-1 rounded-sm disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500 flex justify-center items-center gap-2"
                                  onClick={() =>
                                    sentVerificationOTP(
                                      acc.userId,
                                      acc.emailId as string
                                    )
                                  }
                                >
                                  {isLoading &&
                                    otpDialog.user_id === acc.userId && (
                                      <CircularProgress
                                        size={24}
                                        sx={{
                                          "&.MuiCircularProgress-root": {
                                            color: "#62748e",
                                          },
                                        }}
                                      />
                                    )}
                                  Verify
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </RadioGroup>
              )}
            />
            <p className="text-red-600 text-sm min-h-5">
              {primaryAccErrors.primary_account
                ? (primaryAccErrors.primary_account?.message as string)
                : errors
                ? errors
                : ""}
            </p>
          </div>

          {/* Footer */}
          <div className="px-14 py-5 border-t border-t-slate-300 flex items-center justify-between">
            <button
              type="button"
              className="min-w-[90px] py-1.5 bg-red-700 rounded-sm text-white font-medium cursor-pointer"
              onClick={handleBackAction}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="min-w-[90px] py-1.5 bg-blue-700 rounded-sm text-white font-medium cursor-pointer disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500 flex justify-center items-center gap-2"
            >
              {isLoading && isAllVerified && (
                <CircularProgress
                  size="16px"
                  sx={{
                    "&.MuiCircularProgress-root": {
                      color: "#62748e",
                    },
                  }}
                />
              )}
              Next
            </button>
          </div>
        </form>
      </div>

      {/* Instruction Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={instrucDialog}
        // onClose={closeInstrucDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            overflow: "hidden",
          },
        }}
      >
        <form
          className="relative h-[calc(100vh-120px)] max-h-[calc(100vh-120px) bg-white overflow-hidden flex flex-col gap-4"
          onSubmit={userConsentSubmit(handleUserConsent)}
        >
          {/* header */}
          <div className="p-4 flex justify-between  items-center">
            <p className="text-2xl text-center font-semibold">
              Merger Instructions
            </p>
            <button
              type="button"
              onClick={() => {
                router.replace("/dashboard");
                closeInstrucDialog();
              }}
              className="cursor-pointer"
            >
              <IoMdClose className="text-2xl text-red-500 z-1000" />
            </button>
          </div>

          {/* Main content */}
          <div className="p-4 flex-1 overflow-y-auto">
            <p>Please note we are merging the account as mentioned below</p>
            <ul className="ps-10 list-disc py-4">
              <li className="font-semibold">{PrimaryAccData?.userEmail}</li>
              <li className="font-semibold">{SeconadaryAccData?.userEmail}</li>
            </ul>

            <p className="mb-4">
              To avoid any interruption in merger we will log out the these 2
              account from all other devices. Once merging is finish you can
              login in with your credentials.
            </p>
            <p className="mb-4">
              In merging process we will combine all your data in Primary
              account(as choose by you) and you secondary account will be
              archived so that in single Merged account you can access from both
              account credentials.
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 text-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <Controller
                name="merger_user_content"
                control={userConsentControl}
                rules={{
                  required: {
                    value: true,
                    message: "User consent us required!",
                  },
                }}
                render={({ field: { onChange, value, name } }) => (
                  <Checkbox name={name} onChange={onChange} checked={value} />
                )}
              />

              <div className="text-sm text-left">
                <p>I have read the all instructions and,</p>
                <p>
                  I agree with all of conditions and giving my consent to start
                  merging process.
                </p>
              </div>
            </label>

            <p className="text-[13px] min-h-5 text-red-700 text-left ps-5">
              {userConsentErrors.merger_user_content
                ? userConsentErrors.merger_user_content?.message
                : " "}
            </p>

            <button
              type="submit"
              className="min-w-[90px] py-1.5 bg-primary/90 hover:bg-primary rounded-sm text-white font-medium cursor-pointer"
            >
              Start
            </button>
          </div>
        </form>
      </Dialog>

      {/* OTP Verification Doalig */}
      <Dialog
        open={otpDialog.status}
        onClose={closeOtpDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            overflow: "hidden",
          },
        }}
      >
        <div className="w-xl bg-white h-[calc(100vh-64px)]">
          {/* header */}
          <div className="p-4 font-semibold bg-primary text-white border-b flex justify-between">
            <p>Account Verification</p>
            <button
              type="button"
              disabled={isLoading}
              onClick={closeOtpDialog}
              className="cursor-pointer disabled:text-slate-500 disabled:cursor-default"
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>

          {/* Main content */}
          <div className="p-4">
            <p className="font-semibold text-2xl sm:text-[32px] leading-normal mb-4">
              OTP Verification
            </p>

            <p className="text-sm">
              Please enter the OTP(One Time Password) sent to&nbsp;
              <span className="font-semibold underline underline-offset-2">
                {otpDialog.status ? otpDialog.email_id : ""}
              </span>
              &nbsp;to complete verification.
            </p>

            <form
              className="w-full"
              onSubmit={otpSubmit(handleOtpVerification)}
            >
              {/* OTP */}
              <div className="my-12">
                <div className="mb-2">
                  <Controller
                    name="otp"
                    control={otpControl}
                    render={({ field: { value, onChange } }) => (
                      <OtpInput
                        value={value}
                        onChange={onChange}
                        numInputs={6}
                        containerStyle="p-4 flex justify-center items-center gap-4"
                        inputStyle="min-w-12 h-12 text-xl font-semibold border rounded-md"
                        isDisabled={isLoading}
                        disabledStyle="bg-slate-300 border-slate-500"
                        hasErrored={otpErrors.otp ? true : false}
                        errorStyle="border-2 border-red-600"
                        isInputNum={true}
                        isInputSecure={true}
                      />
                    )}
                  />

                  <p className="text-sm text-red-600 min-h-5">
                    {otpErrors.otp ? otpErrors.otp.message : " "}
                  </p>
                </div>

                {
                  <div className="flex justify-between items-center mb-10">
                    {/* Timer */}
                    <div className="flex items-center gap-2">
                      {isTimerRunning && (
                        <>
                          <span>Remaining time:</span>
                          <OtpTimer
                            props={{
                              time: 60,
                              startTimerNow: isTimerRunning,
                              setStartTimerNow: setIsTimerRunning,
                              setIsExpired: setIsOtpExpired,
                            }}
                          />
                        </>
                      )}
                    </div>

                    {/* Resend */}
                    <div className="flex items-center gap-2">
                      <span>Don't recevied the code?</span>
                      <button
                        type="button"
                        disabled={isLoading}
                        className="font-semibold cursor-pointer text-primary disabled:text-slate-500 disabled:cursor-default flex items-center gap-1"
                        onClick={() =>
                          sentVerificationOTP(
                            otpDialog.user_id,
                            otpDialog.email_id
                          )
                        }
                      >
                        {isLoading && isOtpExpired && (
                          <CircularProgress
                            size={16}
                            sx={{
                              "&.MuiCircularProgress-root": {
                                color: "#62748e",
                              },
                            }}
                          />
                        )}
                        Resend
                      </button>
                    </div>
                  </div>
                }
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary cursor-pointer text-white font-semibold text-lg rounded-lg disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500 flex justify-center items-center gap-2"
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
                Verify
              </button>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Merger_1;
