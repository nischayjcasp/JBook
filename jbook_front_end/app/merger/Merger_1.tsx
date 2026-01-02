import EmailVerifyTimer from "@/components/merger/EmailVerifyTimer";
import { AppDispatch, ReduxStore, RootState } from "@/redux/store";
import {
  mergerNext,
  setPrimaryAccData,
  setSecondaryAccData,
} from "@/redux/slices/mergerSlice";
import {
  Checkbox,
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

export interface SelectedAccType {
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

  const PrimaryAccEmail = useSelector(
    (state: RootState) => state.merger.primaryAcc.email
  );
  const SeconadaryAccEmail = useSelector(
    (state: RootState) => state.merger.secondaryAcc.email
  );

  const [errors, setErrors] = useState<string | null>(null);

  const [selectedAcc, setSelectedAcc] = useState<SelectedAccType[]>([]);

  // Setting the accounts list
  useEffect(() => {
    if (PrimaryAccEmail) {
      setSelectedAcc([
        {
          emailId: PrimaryAccEmail,
          isVerified: false,
          startTimer: false,
          isPrimary: false,
          isExpired: false,
        },
      ]);
    }

    if (SeconadaryAccEmail) {
      setSelectedAcc((prev) => [
        ...prev,
        {
          emailId: SeconadaryAccEmail,
          isVerified: false,
          startTimer: false,
          isPrimary: false,
          isExpired: false,
        },
      ]);
    }
  }, []);

  const mergerActiveStep = useSelector(
    (state: RootState) => state.merger.mergerActiveStep
  );

  const openInstrucDialog = () => {
    setInstrucDialog(true);
  };

  const closeInstrucDialog = () => {
    setInstrucDialog(false);
  };

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

  const handleUserConsent = (data: any) => {
    console.log("user consent:", data);
    closeInstrucDialog();
  };

  //   Email verification
  const sendEmailVerification = (indexNo: number) => {
    console.log(
      "selectedAcc[indexNo].startTimer",
      selectedAcc[indexNo].startTimer
    );
    if (selectedAcc[indexNo].startTimer === false) {
      let temp = [...selectedAcc];
      temp[indexNo].startTimer = true;
      setSelectedAcc(temp);
      toast.info(`Verification link to sent to ${temp[indexNo].emailId}`);
    } else {
      toast.error(
        "Link is already sent, once it is expired you can resend it!"
      );
    }
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
  } = useForm();

  const PrimaryAcc = primaryAccWatch("primary_account");

  useEffect(() => {
    console.log("PrimaryAcc: ", PrimaryAcc);
    selectedAcc.forEach((acc) => {
      acc.isPrimary = false;
    });
    const selectedAccInx = selectedAcc.findIndex(
      (acc) => acc.emailId === PrimaryAcc
    );
    if (selectedAccInx != -1) {
      selectedAcc[selectedAccInx].isPrimary = true;
      setSelectedAcc([...selectedAcc]);
    }
  }, [PrimaryAcc]);

  const handleNextStep = (data: any) => {
    console.log("data: ", data);
    //Validate accounts
    // for (let i = 0; i < selectedAcc.length; i++) {
    //   if (!selectedAcc[i].isVerified) {
    //     setErrors(`Please verify account: ${selectedAcc[i].emailId}`);
    //     return;
    //   }
    // }

    //Setting primary & secondary account in redux
    const selectedAccInx = selectedAcc.findIndex(
      (acc) => acc.emailId !== data.primary_account
    );

    if (selectedAccInx != -1) {
      dispatch(
        setPrimaryAccData({
          email: data.primary_account,
        })
      );
      dispatch(
        setSecondaryAccData({
          email: selectedAcc[selectedAccInx].emailId,
        })
      );
    }
    console.log("selectedAccInx: ", selectedAccInx);
    console.log("Selected Acc. State: ", selectedAcc);

    toast.success("Merger Step 1 completed!");

    dispatch(mergerNext());
  };

  return (
    <>
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
                                value={acc.emailId}
                                control={<Radio value={acc.emailId} />}
                                label={acc.emailId}
                                className="w-full"
                              />
                            </td>

                            {/* Verified badge */}
                            <td className="p-1.5">
                              <div>
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
                                    className="w-[90px] mx-auto flex items-center gap-1 text-sm bg-primary/90 hover:bg-primary text-white px-1.5 py-1 rounded-sm cursor-pointer
                              disabled:bg-slate-500 disabled:cursor-none"
                                    onClick={() => {
                                      sendEmailVerification(inx);
                                    }}
                                  >
                                    {acc.isExpired ? (
                                      <p className="w-full text-center">
                                        Resend
                                      </p>
                                    ) : (
                                      <p className="w-full text-center">
                                        Verify
                                      </p>
                                    )}
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

                            {/* Timer */}
                            <td className="min-w-[80px]">
                              <div className="flex items-center gap-3">
                                {/* Timer */}
                                {acc.startTimer && (
                                  <EmailVerifyTimer
                                    props={{ inx, selectedAcc, setSelectedAcc }}
                                  />
                                )}
                              </div>
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
              className="min-w-[90px] py-1.5 bg-blue-700 rounded-sm text-white font-medium cursor-pointer"
            >
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
              <li>abc@gmail.com</li>
              <li>abc1@gmail.com</li>
              <li>abc2@gmail.com</li>
            </ul>

            <p className="mb-4 font-semibold">
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
            <p className="mb-4 text-red-500">
              Note: This merger is Irreversible so once data merge we can not
              undo it.
            </p>
            {/* <p className="mb-4">
              Please give us your consent to go ahead with merger of account
              mentioned above.
            </p> */}
          </div>

          {/* Footer */}
          <div className="p-4 text-center">
            <div className="flex items-center gap-2">
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
            </div>

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
    </>
  );
};

export default Merger_1;
