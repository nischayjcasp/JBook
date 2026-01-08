"use client";

import {
  Avatar,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useRef, useState } from "react";
import {
  IoArrowBack,
  IoSettingsOutline,
  IoShieldCheckmarkSharp,
} from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { BsLayoutSidebar } from "react-icons/bs";
import { ReactNode } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import defaultImage from "@/app/assets/images/default-placeholder.jpg";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addPostSchema,
  AddPostSchemaType,
  deleteAccSchema,
  passChangeSchema,
  PassChangeSchemaType,
  userPhotoSupportedFormats,
  userProfileSchema,
  UserProfileSchemaType,
} from "@/lib/schemas/settings.schema";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  mergerReset,
  setPrimaryAccData,
  setSecondaryAccData,
} from "@/redux/slices/mergerSlice";
import { logoutAPI } from "@/services/auth.service";
import { createPostAPI } from "@/services/post.service";
import {
  fetchAccListAPI,
  fetchUserData,
  updateUserAPI,
} from "@/services/user.serivce";
import { FoundAccsType } from "@/services/user.type";

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UserLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [sideBar, setSideBar] = useState<boolean>(true);
  const [userAccAnchor, setUserAccAnchor] = useState<null | HTMLElement>(null);
  const [settingDialog, setSettingDialog] = useState<boolean>(false);
  const [changePassDialog, setChangePassDialog] = useState<boolean>(false);
  const [delAccDialog, setDelAccDialog] = useState<boolean>(false);
  const [addDialog, setAddDialog] = useState<boolean>(false);
  const [settingActiveTab, setSettingActiveTab] = useState<number>(0);
  const [accountPassEye, setAccountPassEye] = useState<boolean>(false);
  const UserAcc = Boolean(userAccAnchor);
  // const [accounts, setAccounts] = useState<FoundAccsType>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<FoundAccsType[]>([]);
  const [changeCurrentPassEye, setChangeCurrentPassEye] =
    useState<boolean>(false);
  const [changeNewPassEye, setChangeNewPassEye] = useState<boolean>(false);
  const [changeCNewPassEye, setChangeCNewPassEye] = useState<boolean>(false);
  const [deleteAccPassEye, setDeleteAccPassEye] = useState<boolean>(false);
  const [userPic, setUserPic] = useState<string | null>(null);
  const [PostPhoto, setPostPhoto] = useState<string | null>(null);
  const [selectedMergeAcc, setSelectedMergeAcc] = useState<Record<string, any>>(
    {}
  );
  const mergeAccSeachInput = useRef<HTMLInputElement | null>(null);

  const isMerging = useSelector(
    (state: RootState) => state.merger.mergingProgress.isMerging
  );
  const PrimaryAccData = {
    email: "abc1@gmail.com",
  };

  const userData = useSelector((state: RootState) => state.user.userData);

  const openUserAccMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserAccAnchor(event.currentTarget);
  };
  const closeUserAccMenu = () => {
    setUserAccAnchor(null);
  };

  const handleSettingTabs = (event: React.SyntheticEvent, newValue: number) => {
    setSettingActiveTab(newValue);
  };

  // Account Form
  const {
    handleSubmit: accountSubmit,
    control: accountControl,
    watch: accountFormWatch,
    setValue: accountSetValue,
    reset: accountReset,
    formState: { errors: accountErrors },
  } = useForm({
    resolver: yupResolver(userProfileSchema),
    defaultValues: {
      user_photo: "",
      user_display_name: "",
      user_username: "",
      user_dob: undefined,
      user_email: "",
      user_gender: "",
      user_password: "*********",
    },
  });

  const userPhoto: any = accountFormWatch("user_photo");

  useEffect(() => {
    console.log("userPhoto", userPhoto);
    if (userPhoto && userPhotoSupportedFormats.includes(userPhoto.type)) {
      const photoUrl = URL.createObjectURL(userPhoto);
      console.log("photoUrl", photoUrl);
      // accountSetValue("user_photo", photoUrl);
      setUserPic(photoUrl);
    } else {
      setUserPic("");
    }
  }, [userPhoto]);

  const handleAccountSave = async (data: UserProfileSchemaType) => {
    console.log(data);
    setLoading(true);

    try {
      let updateUserData = new FormData();

      updateUserData.append("signup_display_name", data.user_display_name);
      updateUserData.append("signup_gender", data.user_gender);
      updateUserData.append(
        "signup_dob",
        new Date(data.user_dob).toISOString()
      );

      if (data.user_photo) {
        updateUserData.append("user_photo", data.user_photo as File);
      }

      const updateUserRes = await updateUserAPI(
        userData.userId,
        updateUserData
      );

      console.log("updateUserRes: ", updateUserRes);

      if (updateUserRes.status === 200) {
        toast.success(updateUserRes.message);
        await fetchUserData();
        // openSettingDialog();
      } else {
        toast.error(updateUserRes.message);
      }
    } catch (error: unknown) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Add post form
  const postRandNum = Math.ceil(Math.random() * 10000);
  const postRandumText = `What is Lorem Ipsum? ${postRandNum}
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  const {
    control: addPostControl,
    handleSubmit: addPostSubmit,
    watch: postWatch,
    reset: addPostReset,
    formState: { errors: addPostErrors },
  } = useForm({
    resolver: yupResolver(addPostSchema),
    defaultValues: {
      post_title: `Post title - ${postRandNum}`,
      post_text: postRandumText,
    },
  });

  const postPhoto: any = postWatch("post_photo");

  useEffect(() => {
    console.log("post_photo", postPhoto);
    if (postPhoto && userPhotoSupportedFormats.includes(postPhoto.type)) {
      const photoUrl = URL.createObjectURL(postPhoto);
      console.log("photoUrl", photoUrl);
      setPostPhoto(photoUrl);
    } else setPostPhoto(null);
  }, [postPhoto]);

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    if (!isLoading) {
      setAddDialog(false);
      addPostReset();
    }
  };

  const onAddPost = async (data: AddPostSchemaType) => {
    console.log(data);
    setLoading(true);

    try {
      let createPostData = new FormData();

      createPostData.append("post_title", data.post_title);
      createPostData.append("post_text", data.post_text);

      if (data.post_photo) {
        createPostData.append("post_photo", data.post_photo as File);
      }

      const createPostRes = await createPostAPI(createPostData);

      console.log("createPostRes: ", createPostRes);

      if (createPostRes.status === 201) {
        toast.success(createPostRes.message);
        closeAddDialog();
        window.location.reload();
      } else {
        toast.error(createPostRes.message);
      }
    } catch (error: unknown) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Change password form
  const {
    control: changePassControl,
    handleSubmit: changePassSubmit,
    reset: changePassReset,
    formState: { errors: changePassErrors },
  } = useForm<PassChangeSchemaType>({
    resolver: yupResolver(passChangeSchema),
  });

  const onPassChange = (data: any) => {
    console.log(data);
  };

  const openChangePassDialog = () => {
    setChangePassDialog(true);
    changePassReset();
  };

  const closeChangePassDialog = () => {
    setChangePassDialog(false);
    changePassReset();
  };

  //Delete account form
  const {
    control: delAccControl,
    handleSubmit: delAccSubmit,
    reset: delAccReset,
    formState: { errors: delAccErrors },
  } = useForm({
    resolver: yupResolver(deleteAccSchema),
  });

  const onDeleteAcc = (data: any) => {
    console.log(data);
  };

  const openDelAccDialog = () => {
    setDelAccDialog(true);
  };

  const closeDelAccDialog = () => {
    setDelAccDialog(false);
    delAccReset();
  };

  const openSettingDialog = () => {
    setSettingDialog(true);

    // Setting account form values
    if (userData) {
      console.log("userData: ", userData);
      // accountSetValue("user_photo", userData.userPhoto);
      setUserPic(userData.userPhoto);
      accountSetValue("user_display_name", userData.userDisplayName);
      accountSetValue("user_username", userData.userName);
      accountSetValue("user_dob", new Date(userData.userDob));
      accountSetValue("user_email", userData.userEmail);
      accountSetValue("user_gender", userData.userGender);
      accountSetValue("user_password", "*********");
    }
  };

  const closeSettingDialog = () => {
    if (!isLoading) {
      setSettingDialog(false);
      accountReset();
      setUserPic("");
      setSettingActiveTab(0);
    }
  };

  // Merge Account search
  const handleAccSearch = async (text: string) => {
    console.log("text: ", text);
    try {
      const fetchAccRes = await fetchAccListAPI(text);

      console.log("fetchAccRes: ", fetchAccRes);

      setFilteredAccounts([...fetchAccRes.users]);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //
  const {
    handleSubmit: selectAccSubmit,
    watch: selectAccWatch,
    control: selectAccControl,
    reset: selectAccReset,
    formState: { errors: selectAccErrors },
  } = useForm({
    // resolver: yupResolver(),
  });

  const SelectedAcc = selectAccWatch("selectedAcc");

  const handleCheckAcc = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && event.target.value) {
      setSelectedMergeAcc({
        emailId: event.target.value,
      });
    }
  };

  const onMergeStart = (data: any) => {
    console.log("Selected Accounts: ", data);
    dispatch(mergerReset());
    dispatch(setPrimaryAccData(PrimaryAccData));
    dispatch(
      setSecondaryAccData({
        email: SelectedAcc,
      })
    );
    router.push("/merger");
  };

  const handleLogout = async () => {
    try {
      const logoutRes = await logoutAPI();

      console.log("logoutRes: ", logoutRes);

      if (logoutRes.status === 200) {
        toast.success(logoutRes.message);
        router.replace("/login");
      } else {
        toast.error(logoutRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      toast.error(err.message);
    }
  };

  useEffect(() => {
    closeChangePassDialog();
    closeDelAccDialog();
    selectAccReset();
  }, [settingActiveTab]);

  return (
    <div className="w-full max-h-screen overflow-hidden flex">
      {/* Side bar */}
      <div
        className={`bg-[#FCFAF8] w-[300px] h-screen p-4 overflow-y-auto hideScrollBar transition-[margin] duration-500 ease-in-out ${
          sideBar ? "m-0" : "-ms-[300px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          {/* User Dropdown */}
          <div>
            <button
              type="button"
              id="userAccButton"
              aria-controls={UserAcc ? "userAccMenus" : undefined}
              aria-haspopup="true"
              aria-expanded={UserAcc ? "true" : undefined}
              onClick={openUserAccMenu}
              className="px-2 py-1 flex items-center gap-2 rounded-lg bg-transparent hover:bg-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  alt="User photo"
                  src={userData.userPhoto ?? "/userDefaultPic.jpg"}
                  sx={{ width: 28, height: 28 }}
                />

                <p className="text-black text-sm font-semibold capitalize">
                  {userData.userDisplayName ?? "Guest"}
                </p>
              </div>
              <IoIosArrowDown />
            </button>
            <Menu
              id="userAccMenus"
              anchorEl={userAccAnchor}
              open={UserAcc}
              onClose={closeUserAccMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              slotProps={{
                list: {
                  "aria-labelledby": "userAccButton",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  openSettingDialog();
                  closeUserAccMenu();
                }}
              >
                <div className="flex items-center gap-1">
                  <IoSettingsOutline className="text-2xl" />
                  <span className="leading-px">Settings</span>
                </div>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <div className="flex items-center gap-1">
                  <MdLogout className="text-2xl" />
                  <span className="leading-px">Logout</span>
                </div>
              </MenuItem>
            </Menu>
          </div>

          <button
            type="button"
            className={`p-2 cursor-pointer`}
            onClick={() => setSideBar(!sideBar)}
          >
            <BsLayoutSidebar className="text-xl" />
          </button>
        </div>

        <ul className="flex flex-col">
          <li className="hover:bg-slate-200">
            <button
              disabled={isMerging}
              type="button"
              className="w-full p-2 flex items-center text-primary disabled:text-slate-300 gap-2 cursor-pointer disabled:cursor-not-allowed"
              onClick={openAddDialog}
            >
              <FaCirclePlus className="text-[25px]" />
              <span className="text-sm font-semibold">Add post</span>
            </button>
          </li>
        </ul>

        {/* Add post dialog */}
        <Dialog
          fullWidth={true}
          maxWidth={"sm"}
          open={addDialog}
          onClose={closeAddDialog}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "10px",
              overflow: "hidden",
            },
          }}
        >
          <div
            className={`relative max-h-[calc(100vh-64px)] ${
              isLoading ? "overflow-hidden" : "overflow-y-auto"
            } hideScrollBar`}
          >
            {/* Loader */}
            {isLoading && (
              <div className="sticky inset-0 min-h-[calc(100vh-64px)] h-full w-full z-1500 bg-black/40 flex items-center justify-center">
                <CircularProgress
                  size="34px"
                  sx={{
                    "&.MuiCircularProgress-root": {
                      color: "#e1533c",
                    },
                  }}
                />
              </div>
            )}

            {/* Header */}
            <div className="z-10 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200 flex justify-between">
              <p>Add Post</p>
              <button
                type="button"
                onClick={closeAddDialog}
                className="cursor-pointer"
              >
                <IoMdClose className="text-2xl text-red-500" />
              </button>
            </div>

            {/* Add Form */}
            <form
              className="w-full p-4"
              encType="multipart/form-data"
              onSubmit={addPostSubmit(onAddPost)}
            >
              {/* Post title */}
              <div className="mb-2">
                <Controller
                  name="post_title"
                  control={addPostControl}
                  render={({ field: { value, onChange, name } }) => (
                    <TextField
                      label="Post title"
                      placeholder="Enter post title"
                      name={name}
                      value={value}
                      onChange={onChange}
                      variant="outlined"
                      className="w-full"
                      error={addPostErrors.post_title?.message ? true : false}
                      helperText={
                        addPostErrors.post_title?.message
                          ? `${addPostErrors.post_title.message}`
                          : " "
                      }
                    />
                  )}
                />
              </div>

              {/* Post text */}
              <div className="mb-2">
                <Controller
                  name="post_text"
                  control={addPostControl}
                  render={({ field: { value, onChange, name } }) => (
                    <TextField
                      multiline
                      minRows={4}
                      label="Description"
                      placeholder="Enter post description... "
                      name={name}
                      value={value}
                      onChange={onChange}
                      variant="outlined"
                      className="w-full"
                      error={addPostErrors.post_text?.message ? true : false}
                      helperText={
                        addPostErrors.post_text?.message
                          ? `${addPostErrors.post_text.message}`
                          : " "
                      }
                    />
                  )}
                />
              </div>

              {/* Photo */}
              <div className="flex flex-col gap-2 mb-7">
                <div className="flex flex-col">
                  <div className="flex  items-center gap-5 mb-2">
                    <p className="font-semibold">Photo</p>
                    <Controller
                      name="post_photo"
                      control={addPostControl}
                      render={({ field: { name, value, onChange } }) => (
                        <label>
                          <p className="inline-block px-2.5 py-1.5 text-sm rounded-md bg-primary text-white text-nowrap font-semibold cursor-pointer">
                            Choose photo
                          </p>
                          <VisuallyHiddenInput
                            type="file"
                            name={name}
                            onChange={(event) => {
                              if (event.target.files)
                                onChange(event.target.files[0]);
                            }}
                          />
                        </label>
                      )}
                    />
                    <p className="max-w-full overflow-x-hidden text-black/70 text-xs">
                      {postPhoto && postPhoto?.name}
                    </p>
                  </div>

                  <p className="min-h-6 text-red-500 text-xs">
                    {addPostErrors.post_photo
                      ? addPostErrors.post_photo?.message
                      : " "}
                  </p>
                </div>

                <div className="flex-1 mx-auto border border-slate-300 rounded-lg">
                  <Image
                    src={
                      !accountErrors.user_photo?.message && PostPhoto
                        ? PostPhoto
                        : defaultImage
                    }
                    alt="Post image"
                    width={500}
                    height={300}
                    className="h-auto max-h-[300px] rounded-lg"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-3 py-2 rounded-md bg-primary text-white font-semibold cursor-pointer"
                >
                  {isLoading ? "Adding..." : "Add Post"}
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>

      {/* Main content : post grid + pagination */}
      <div className="flex-1 relative overflow-hidden">
        <button
          type="button"
          className={`z-999 absolute top-4 left-4 p-2 cursor-pointer transition-[scale] duration-500 ${
            sideBar ? "scale-0" : "scale-100"
          }`}
          onClick={() => setSideBar(!sideBar)}
        >
          <BsLayoutSidebar className="text-xl" />
        </button>

        {children}
      </div>

      {/* Settings Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={settingDialog}
        onClose={closeSettingDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
          },
        }}
      >
        <div className="relative h-[calc(100vh-120px)] max-h-[calc(100vh-120px) bg-white flex overflow-hidden">
          {/* Tabs */}
          <div className="w-[220px] bg-[#fcfaf8]">
            <p className="p-3 min-h-[57px] font-semibold border-e border-e-slate-200">
              Settings
            </p>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={settingActiveTab}
              onChange={handleSettingTabs}
              aria-label="Vertical tabs example"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                "&.MuiTabs-root": {
                  height: "100%",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#e1533c !important",
                },
                "& .Mui-selected": {
                  color: "#e1533c !important",
                  backgroundColor: "#ffefe5",
                },
                "& .MuiTab-root": {
                  alignItems: "flex-start !important",
                  fontWeight: 500,
                },
              }}
            >
              <Tab label="Account" disabled={isLoading} />
              <Tab label="Merge" disabled={isLoading} />
            </Tabs>
          </div>

          {/* Tab content */}
          <div className="relative w-full overflow-y-auto hideScrollBar">
            {/* Accounts */}
            {settingActiveTab === 0 && (
              <div className="">
                {/* Header */}
                <div className="z-10 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200 flex justify-between">
                  <p>Account</p>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={closeSettingDialog}
                    className="cursor-pointer text-red-500 disabled:cursor-default disabled:text-slate-500"
                  >
                    <IoMdClose className="text-2xl z-1000" />
                  </button>
                </div>

                <form
                  className="p-4 pb-0"
                  onSubmit={accountSubmit(handleAccountSave)}
                >
                  {/* Photo */}
                  <div className="mb-3">
                    <p className="font-semibold mb-2">User Photo</p>

                    <div className="flex-1 flex flex-col gap-3">
                      <div className="">
                        <Controller
                          name="user_photo"
                          control={accountControl}
                          render={({ field: { name, value, onChange } }) => (
                            <label className="flex items-center gap-4">
                              <div>
                                <Avatar
                                  alt="Remy Sharp"
                                  src={userPic ?? "/userDefaultPic.jpg"}
                                  sx={{ width: "90px", height: "90px" }}
                                />
                              </div>
                              <div>
                                <p className="inline-block px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer">
                                  Choose photo
                                </p>
                                <VisuallyHiddenInput
                                  type="file"
                                  name={name}
                                  onChange={(event) => {
                                    if (event.target.files)
                                      onChange(event.target.files[0]);
                                  }}
                                />
                              </div>
                            </label>
                          )}
                        />
                      </div>

                      <div>
                        <p className="min-h-4 max-w-full overflow-x-hidden text-black/70 text-xs mb-2">
                          {userPhoto
                            ? `${userPhoto.name
                                .split(".")[0]
                                .slice(0, 30)}... .${
                                userPhoto.name.split(".")[1]
                              }`
                            : "No file selected"}
                        </p>
                        <p className="min-h-4 text-red-500 text-xs">
                          {accountErrors.user_photo
                            ? accountErrors.user_photo?.message
                            : " "}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="mb-3">
                    <Controller
                      name="user_username"
                      control={accountControl}
                      render={({ field: { value, onChange, name } }) => (
                        <TextField
                          label="Username"
                          disabled
                          name={name}
                          size="small"
                          value={value ?? "Abc"}
                          variant="outlined"
                          className="w-[400px]"
                          helperText={
                            accountErrors.user_username?.message
                              ? `${accountErrors.user_username.message}`
                              : " "
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Display name */}
                  <div className="mb-3 ">
                    <Controller
                      name="user_display_name"
                      control={accountControl}
                      render={({ field: { value, onChange, name } }) => (
                        <TextField
                          label="Display Name"
                          name={name}
                          value={value}
                          size="small"
                          onChange={onChange}
                          variant="outlined"
                          className="w-[400px]"
                          error={
                            accountErrors.user_display_name?.message
                              ? true
                              : false
                          }
                          helperText={
                            accountErrors.user_display_name?.message
                              ? `${accountErrors.user_display_name.message}`
                              : " "
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Birthdate */}
                  <div className="mb-3">
                    <Controller
                      name="user_dob"
                      control={accountControl}
                      render={({ field: { value, onChange, name } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name={name}
                            label="Birthdate"
                            format="DD-MM-YYYY"
                            value={dayjs(value)}
                            onChange={(value) =>
                              onChange(dayjs(value).toDate())
                            }
                            slotProps={{
                              textField: {
                                error: accountErrors.user_dob?.message
                                  ? true
                                  : false,
                                helperText: accountErrors.user_dob?.message
                                  ? `${accountErrors.user_dob.message}`
                                  : " ",
                              },
                            }}
                            sx={{
                              "&.MuiPickersTextField-root": {
                                width: "400px",
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </div>

                  {/* Gender */}
                  <div className="mb-2">
                    <Controller
                      name="user_gender"
                      control={accountControl}
                      render={({ field: { name, value, onChange } }) => (
                        <div className="w-[400px]">
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
                            {accountErrors.user_gender?.message ? (
                              `${accountErrors.user_gender.message}`
                            ) : (
                              <>&nbsp;</>
                            )}
                          </p>
                        </div>
                      )}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-2">
                    <Controller
                      name="user_email"
                      control={accountControl}
                      render={({ field: { value, onChange, name } }) => (
                        <TextField
                          label="Email"
                          placeholder="Enter email "
                          name={name}
                          size="small"
                          value={value}
                          disabled
                          onChange={onChange}
                          variant="outlined"
                          className="w-[400px]"
                          error={false}
                          helperText={" "}
                        />
                      )}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <div className="mb-3">
                      <Controller
                        name="user_password"
                        control={accountControl}
                        render={({ field: { onChange, name } }) => (
                          <TextField
                            disabled
                            type={accountPassEye ? "text" : "password"}
                            label="Password"
                            placeholder="Enter password "
                            size="small"
                            name={name}
                            value={"***********"}
                            onChange={onChange}
                            variant="outlined"
                            className="w-[400px]"
                            error={false}
                            helperText={" "}
                          />
                        )}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer"
                        onClick={openChangePassDialog}
                      >
                        Change Password
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer"
                      >
                        Add Password
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="my-7">
                    <p className="font-semibold mb-3">Delete Account:&nbsp;</p>
                    <p className="text-sm mb-2">
                      Deleting your account is permanent. You will immediately
                      lose access to all your data.{" "}
                    </p>
                    <button
                      type="button"
                      className="px-2.5 py-1.5 text-sm rounded-md bg-red-600 text-white font-semibold cursor-pointer"
                      onClick={openDelAccDialog}
                    >
                      Delete Account
                    </button>
                  </div>

                  {/* Save & cancel button */}
                  <div className="z-10 sticky bottom-0 bg-white flex py-4 border-t border-t-slate-200 justify-end gap-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      className="py-2 px-3 bg-slate-200 hover:bg-slate-200 cursor-pointer  font-semibold text-sm rounded-md disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                      onClick={closeSettingDialog}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="py-2 px-3 bg-primary cursor-pointer text-white text-sm font-semibold rounded-md flex justify-center items-center gap-2 disabled:bg-slate-200 disabled:cursor-default disabled:text-slate-500"
                    >
                      {/* Loader */}
                      {isLoading && (
                        <CircularProgress
                          size="16px"
                          sx={{
                            "&.MuiCircularProgress-root": {
                              color: "#62748e",
                            },
                          }}
                        />
                      )}
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change password dialog */}
            {changePassDialog && (
              <div className="z-990 sticky inset-0 w-full h-full bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 font-semibold bg-white border-b border-slate-200 flex justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={closeChangePassDialog}
                    >
                      <IoArrowBack className="text-xl" />
                    </button>
                    <p>Change Password</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeChangePassDialog}
                    className="cursor-pointer"
                  >
                    <IoMdClose className="text-2xl text-red-500 z-1000" />
                  </button>
                </div>

                {/* Content */}
                <form
                  className="flex-1 p-4 flex flex-col justify-between"
                  onSubmit={changePassSubmit(onPassChange)}
                >
                  {/* Inputs */}
                  <div>
                    {/* Current Password */}
                    <div className="mb-2">
                      <Controller
                        name="currrent_password"
                        control={changePassControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            type={changeCurrentPassEye ? "text" : "password"}
                            size="small"
                            label="Current Password"
                            placeholder="Enter current password "
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
                                      onClick={() =>
                                        setChangeCurrentPassEye(
                                          !changeCurrentPassEye
                                        )
                                      }
                                    >
                                      {changeCurrentPassEye ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </button>
                                  </InputAdornment>
                                ),
                              },
                            }}
                            error={
                              changePassErrors.currrent_password?.message
                                ? true
                                : false
                            }
                            helperText={
                              changePassErrors.currrent_password?.message
                                ? `${changePassErrors.currrent_password.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>

                    {/* New Password */}
                    <div className="mb-2">
                      <Controller
                        name="new_password"
                        control={changePassControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            type={changeNewPassEye ? "text" : "password"}
                            size="small"
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
                                      onClick={() =>
                                        setChangeNewPassEye(!changeNewPassEye)
                                      }
                                    >
                                      {changeNewPassEye ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </button>
                                  </InputAdornment>
                                ),
                              },
                            }}
                            error={
                              changePassErrors.new_password?.message
                                ? true
                                : false
                            }
                            helperText={
                              changePassErrors.new_password?.message
                                ? `${changePassErrors.new_password.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>

                    {/* Confirm new Password */}
                    <div className="mb-2">
                      <Controller
                        name="cnew_password"
                        control={changePassControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            size="small"
                            type={changeCNewPassEye ? "text" : "password"}
                            label="Confirm Password"
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
                                      onClick={() =>
                                        setChangeCNewPassEye(!changeCNewPassEye)
                                      }
                                    >
                                      {changeCNewPassEye ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </button>
                                  </InputAdornment>
                                ),
                              },
                            }}
                            error={
                              changePassErrors.cnew_password?.message
                                ? true
                                : false
                            }
                            helperText={
                              changePassErrors.cnew_password?.message
                                ? `${changePassErrors.cnew_password.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="py-2 px-3 bg-slate-200 hover:bg-slate-200 cursor-pointer  font-semibold text-sm rounded-md"
                      onClick={() => {
                        closeChangePassDialog();
                        changePassReset();
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="py-2 px-3 bg-primary cursor-pointer text-white text-sm font-semibold rounded-md"
                    >
                      Change password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Delete Account dialog */}
            {delAccDialog && (
              <div className="z-990 sticky inset-0 w-full h-full bg-white flex flex-col overflow-y-auto hideScrollBar">
                {/* Header */}
                <div className="z-991 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200 flex justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={closeDelAccDialog}
                    >
                      <IoArrowBack className="text-xl" />
                    </button>
                    <p>Delete Account</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDelAccDialog}
                    className="cursor-pointer"
                  >
                    <IoMdClose className="text-2xl text-red-500 z-1000" />
                  </button>
                </div>

                {/* Content */}
                <form
                  className="flex-1 p-4 flex flex-col justify-between"
                  onSubmit={delAccSubmit(onDeleteAcc)}
                >
                  {/* Inputs */}
                  <div>
                    <p className="text-sm mb-4">
                      We'll be sorry to see you go, but thanks for trying JBook
                    </p>
                    <p className="text-sm mb-7">
                      Deleting your account requires your current password as
                      confirmation. If you signed up via Google, Facebook, or
                      Apple, you must first set a password in{" "}
                      <button
                        type="button"
                        className="underline text-primary cursor-pointer"
                        onClick={closeDelAccDialog}
                      >
                        Account settings
                      </button>
                      .
                    </p>
                    {/* Reason for deleting (optional) */}
                    <div className="mb-2">
                      <Controller
                        name="reason_fot_delete"
                        control={delAccControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            multiline
                            minRows={4}
                            label="Reason for deleting (optional)"
                            placeholder="Enter reasons here... "
                            name={name}
                            value={value}
                            onChange={onChange}
                            variant="outlined"
                            className="w-full"
                            error={
                              delAccErrors.reason_fot_delete?.message
                                ? true
                                : false
                            }
                            helperText={
                              delAccErrors.reason_fot_delete?.message
                                ? `${delAccErrors.reason_fot_delete.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-2">
                      <Controller
                        name="del_acc_email"
                        control={delAccControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            label="Email"
                            size="small"
                            placeholder="Enter email "
                            name={name}
                            value={value}
                            onChange={onChange}
                            variant="outlined"
                            className="w-full"
                            error={
                              delAccErrors.del_acc_email?.message ? true : false
                            }
                            helperText={
                              delAccErrors.del_acc_email?.message
                                ? `${delAccErrors.del_acc_email.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>

                    {/* Current Password */}
                    <div className="mb-2">
                      <Controller
                        name="del_acc_password"
                        control={delAccControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            type={deleteAccPassEye ? "text" : "password"}
                            size="small"
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
                                      onClick={() =>
                                        setDeleteAccPassEye(!deleteAccPassEye)
                                      }
                                    >
                                      {deleteAccPassEye ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </button>
                                  </InputAdornment>
                                ),
                              },
                            }}
                            error={
                              delAccErrors.del_acc_password?.message
                                ? true
                                : false
                            }
                            helperText={
                              delAccErrors.del_acc_password?.message
                                ? `${delAccErrors.del_acc_password.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div>
                    <div>
                      <Controller
                        name="acc_delete_user_consent"
                        control={delAccControl}
                        render={({ field: { value, onChange, name } }) => (
                          <label className="flex items-center">
                            <Checkbox
                              name={name}
                              checked={value}
                              onChange={onChange}
                            />
                            <p>
                              I understand that delete accounts aren't
                              recoverable
                            </p>
                          </label>
                        )}
                      />
                      <p className="min-h-5 text-xs px-4 text-[#d32f2f]">
                        {delAccErrors.acc_delete_user_consent
                          ? delAccErrors.acc_delete_user_consent?.message
                          : " "}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-200 cursor-pointer  font-semibold text-sm rounded-md"
                        onClick={closeDelAccDialog}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="py-2 px-3 bg-primary cursor-pointer text-white text-sm font-semibold rounded-md"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Merge */}
            {settingActiveTab === 1 && (
              <div className="">
                {/* Header */}
                <div className="z-10 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200 flex justify-between">
                  <p>Merge</p>
                  <button
                    type="button"
                    onClick={closeSettingDialog}
                    className="cursor-pointer"
                  >
                    <IoMdClose className="text-2xl text-red-500" />
                  </button>
                </div>

                <div className="p-4 flex flex-col">
                  {/* Connected acc. */}
                  <div className="mb-5">
                    <p className="font-semibold">Connected Account</p>
                    <div className="ms-3">
                      <table className="w-full">
                        <tbody>
                          {userData.conncetedAcc &&
                            userData.conncetedAcc.map((acc, inx) => (
                              <tr key={`Connected-Acc-${inx}`}>
                                {/* Email */}
                                <td className="p-1.5 w-3/5">
                                  <div className="flex items-center gap-3">
                                    <GoDotFill className="text-sm" />
                                    <p className="leading-none">{acc.email}</p>
                                  </div>
                                </td>
                                {/* Verified badge */}
                                <td className="p-1.5 w-1/5">
                                  {acc.isVerified && (
                                    <p className="w-[90px] mx-auto flex items-center gap-1 text-sm bg-green-600 text-white px-1.5 py-1 rounded-sm">
                                      <IoShieldCheckmarkSharp className="text-lg" />
                                      <span>Verified</span>
                                    </p>
                                  )}
                                </td>
                                {/* Primary/Secondary */}
                                <td className="p-1.5 w-1/5">
                                  {acc.isPrimary ? (
                                    <p className="text-sm text-blue-700">
                                      Primary
                                    </p>
                                  ) : (
                                    <p className="text-sm text-slate-500">
                                      Secondary
                                    </p>
                                  )}
                                </td>
                              </tr>
                            ))}

                          {userData.conncetedAcc &&
                            userData.conncetedAcc.length <= 0 && (
                              <tr>
                                <td colSpan={3}>
                                  <p className="py-4 text-red-500 font-semibold">
                                    No connected accounts
                                  </p>
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add account */}
                  <div className="flex-1">
                    <p className="font-semibold mb-5">
                      Want to add/merge account?
                    </p>

                    <div className="max-w-[500px]">
                      {/*Account Search bar */}
                      <form
                        className="w-full relative mb-4"
                        onSubmit={() => {
                          if (mergeAccSeachInput.current)
                            handleAccSearch(mergeAccSeachInput.current.value);
                        }}
                      >
                        <input
                          type="text"
                          ref={mergeAccSeachInput}
                          name="account_search"
                          className="w-full px-3 py-1.5 border rounded-sm"
                          placeholder="Search here.."
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => handleAccSearch(event.target.value)}
                        />
                        <button
                          type="submit"
                          className="absolute top-1/2 -translate-y-1/2 right-0 p-2 cursor-pointer"
                        >
                          <FaSearch className="text-xl" />
                        </button>
                      </form>

                      {/* Selecte Account */}
                      <form onSubmit={selectAccSubmit(onMergeStart)}>
                        <div className="max-h-[200px] overflow-y-auto mb-5">
                          <Controller
                            name="selectedAcc"
                            control={selectAccControl}
                            rules={{
                              required: {
                                value: true,
                                message: "Please select the account!",
                              },
                            }}
                            render={({ field: { onChange, name, value } }) => (
                              <RadioGroup
                                name={name}
                                value={value ?? null}
                                onChange={onChange}
                              >
                                <ul className="ms-4">
                                  {/* Accounts list */}
                                  {filteredAccounts &&
                                    filteredAccounts.map((acc, inx) => (
                                      <li key={`user-acc-${inx}`}>
                                        <FormControlLabel
                                          control={
                                            <Radio
                                              value={acc}
                                              // onChange={handleCheckAcc}
                                            />
                                          }
                                          label={acc.email ?? acc.mobile}
                                        />
                                      </li>
                                    ))}
                                </ul>

                                {filteredAccounts &&
                                  filteredAccounts.length <= 0 && (
                                    <p className="text-red-500 font-semibold text-center p-4">
                                      No account found
                                    </p>
                                  )}
                              </RadioGroup>
                            )}
                          />
                        </div>
                        <p className="text-sm text-red-500 min-h-5 mb-4">
                          {selectAccErrors.selectedAcc &&
                            (selectAccErrors.selectedAcc?.message as string)}
                        </p>
                        <div className="text-center">
                          <button
                            type="submit"
                            className="px-3 py-2 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer"
                          >
                            Merge All
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserLayout;
