"use client";

import jbookLogo from "@/app/favicon.ico";
import {
  Avatar,
  Dialog,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
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

const DefaultNavBar = () => {
  const [userAccAnchor, setUserAccAnchor] = useState<null | HTMLElement>(null);
  const [settingDialog, setSettingDialog] = useState<boolean>(true);
  const [settingActiveTab, setSettingActiveTab] = useState<number>(0);
  const [accountPassEye, setAccountPassEye] = useState<boolean>(false);
  const UserAcc = Boolean(userAccAnchor);

  const openSettingDialog = () => {
    setSettingDialog(true);
  };

  const closeSettingDialog = () => {
    setSettingDialog(true);
  };

  const openUserAccMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserAccAnchor(event.currentTarget);
  };
  const closeUserAccMenu = () => {
    setUserAccAnchor(null);
  };

  const handleSettingTabs = (event: React.SyntheticEvent, newValue: number) => {
    setSettingActiveTab(newValue);
  };

  const {
    control,
    formState: { errors },
  } = useForm();

  // Account Form
  const {
    handleSubmit: accountSubmit,
    control: accountControl,
    setValue: accountSetValue,
    getValues: accountGetValues,
    clearErrors: accountClearErrors,
    reset: accountReset,
    formState: { errors: accountErrors },
  } = useForm({
    // resolver: yupResolver(loginSchema),
    // defaultValues: {
    //   login_email: "",
    //   login_password: "",
    // },
  });

  const handleAccountSave = (data) => {
    console.log(data);
  };

  return (
    <div className="sticky top-0 left-0 right-0 myContainer shadow-sm bg-white z-900">
      <div className="flex items-center justify-between py-3">
        {/* JBook Logo */}
        <div className="flex items-end">
          <Image src={jbookLogo} alt="JBook logo" className="w-9 h-9" />
          <span className="font-medium text-3xl leading-none">Book</span>
        </div>

        {/* Search bar */}
        <form className="w-sm sm:w-lg lg:w-xl">
          <Controller
            name="dash_search"
            control={control}
            render={({ field: { value, onChange, name } }) => (
              <TextField
                type="text"
                label="Search"
                placeholder="Search task"
                size="small"
                name={name}
                value={value}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => {}}
                        >
                          <FaSearch className="text-xl" />
                        </button>
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={onChange}
                variant="outlined"
                className="w-full"
                error={errors.dash_search?.message ? true : false}
              />
            )}
          />
        </form>

        {/* User Dropdown */}
        <div>
          <button
            type="button"
            id="userAccButton"
            aria-controls={UserAcc ? "userAccMenus" : undefined}
            aria-haspopup="true"
            aria-expanded={UserAcc ? "true" : undefined}
            onClick={openUserAccMenu}
            className="p-2 flex items-center gap-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 cursor-pointer"
          >
            <Avatar
              alt="Username"
              src="/userDefaultPic.jpg"
              sx={{ width: 30, height: 30 }}
            />
            <p className="text-black font-semibold text-lg capitalize">
              User Name
            </p>
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
            <MenuItem onClick={closeUserAccMenu}>
              <div className="flex items-center gap-1">
                <MdLogout className="text-2xl" />
                <span className="leading-px">Logout</span>
              </div>
            </MenuItem>
          </Menu>
        </div>

        {/* Settings Dialog */}
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={settingDialog}
          onClose={closeSettingDialog}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "10px",
            },
          }}
        >
          <div className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px) bg-white flex overflow-hidden">
            {/* Tabs */}
            <div className="w-[220px] bg-[#fcfaf8]">
              <p className="p-3 font-semibold border-e border-e-slate-200">
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
                    backgroundColor: "#e1533c",
                  },
                  "& .Mui-selected": {
                    color: "#e1533c",
                  },
                  "& .MuiTab-root": {
                    alignItems: "flex-start",
                  },
                }}
              >
                <Tab label="Account" />
                <Tab label="Merge" />
              </Tabs>
            </div>

            {/* Tab content */}
            <div className="w-full overflow-y-auto hideScrollBar">
              {/* Accounts */}
              {settingActiveTab === 0 && (
                <div className="">
                  <p className="z-10 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200">
                    Account
                  </p>

                  <form className="p-4">
                    {/* Photo */}
                    <div className="mb-7">
                      <p className="font-semibold mb-2">Photon</p>
                      <div className="flex items-center gap-3">
                        <div>
                          <Avatar
                            alt="Remy Sharp"
                            src="/userDefaultPic.jpg"
                            sx={{ width: "90px", height: "90px" }}
                          />
                        </div>
                        <div>
                          <div className="flex gap-2">
                            <label>
                              <p className="inline-block px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer">
                                Choose photo
                              </p>
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(event) =>
                                  console.log(event.target.files)
                                }
                                multiple
                              />
                            </label>
                            <button
                              type="button"
                              className="px-2.5 py-1.5 text-sm rounded-md bg-red-600 text-white font-semibold cursor-pointer"
                            >
                              Remove photo
                            </button>
                          </div>
                          {/* <p className="text-red-500 text-sm px-3 py-1">Error</p> */}
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="mb-3 ">
                      <Controller
                        name="settings_username"
                        control={accountControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            label="Username"
                            name={name}
                            value={value}
                            onChange={onChange}
                            variant="outlined"
                            className="w-[400px]"
                            error={
                              accountErrors.settings_username?.message
                                ? true
                                : false
                            }
                            helperText={
                              accountErrors.settings_username?.message
                                ? `${accountErrors.settings_username.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>

                    {/* Birthdate */}
                    <div className="mb-3">
                      <Controller
                        name="account_dob"
                        control={accountControl}
                        render={({ field: { value, onChange, name } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              name={name}
                              label="Birthdate"
                              format="DD-MM-YYYY"
                              value={value ? dayjs(value) : dayjs("DD-MM-YYYY")}
                              onChange={onChange}
                              slotProps={{
                                textField: {
                                  error: accountErrors.account_dob?.message
                                    ? true
                                    : false,
                                  helperText: accountErrors.account_dob?.message
                                    ? `${accountErrors.account_dob.message}`
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
                        name="account_gender"
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
                              {accountErrors.account_gender?.message ? (
                                `${accountErrors.account_gender.message}`
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
                        name="account_email"
                        control={accountControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            label="Email"
                            placeholder="Enter email "
                            name={name}
                            value={"user@g.com"}
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

                    {/* Sign up Password */}
                    <div className="mb-2">
                      <div>
                        <Controller
                          name="account_password"
                          control={accountControl}
                          render={({ field: { value, onChange, name } }) => (
                            <TextField
                              type={accountPassEye ? "text" : "password"}
                              label="Password"
                              placeholder="Enter password "
                              name={name}
                              value={value}
                              disabled
                              onChange={onChange}
                              variant="outlined"
                              className="w-[400px]"
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setAccountPassEye(!accountPassEye)
                                        }
                                      >
                                        {accountPassEye ? (
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
                                accountErrors.account_password?.message
                                  ? true
                                  : false
                              }
                              helperText={
                                accountErrors.account_password?.message
                                  ? `${accountErrors.account_password.message}`
                                  : " "
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer"
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
                  </form>

                  <div className="p-4">
                    <p className="font-semibold mb-3">Delete Account:&nbsp;</p>

                    <button
                      type="button"
                      className="px-2.5 py-1.5 text-sm rounded-md bg-red-600 text-white font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Merge */}
              {settingActiveTab === 0 && (
                <div className="">
                  <p className="z-10 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200">
                    Account
                  </p>

                  <form className="p-4">
                    {/* Photo */}
                    <div className="mb-7">
                      <p className="font-semibold mb-2">Photon</p>
                      <div className="flex items-center gap-3">
                        <div>
                          <Avatar
                            alt="Remy Sharp"
                            src="/userDefaultPic.jpg"
                            sx={{ width: "90px", height: "90px" }}
                          />
                        </div>
                        <div>
                          <div className="flex gap-2">
                            <label>
                              <p className="inline-block px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer">
                                Choose photo
                              </p>
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(event) =>
                                  console.log(event.target.files)
                                }
                                multiple
                              />
                            </label>
                            <button
                              type="button"
                              className="px-2.5 py-1.5 text-sm rounded-md bg-red-600 text-white font-semibold cursor-pointer"
                            >
                              Remove photo
                            </button>
                          </div>
                          {/* <p className="text-red-500 text-sm px-3 py-1">Error</p> */}
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="mb-3 ">
                      <Controller
                        name="settings_username"
                        control={accountControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            label="Username"
                            name={name}
                            value={value}
                            onChange={onChange}
                            variant="outlined"
                            className="w-[400px]"
                            error={
                              accountErrors.settings_username?.message
                                ? true
                                : false
                            }
                            helperText={
                              accountErrors.settings_username?.message
                                ? `${accountErrors.settings_username.message}`
                                : " "
                            }
                          />
                        )}
                      />
                    </div>

                    {/* Birthdate */}
                    <div className="mb-3">
                      <Controller
                        name="account_dob"
                        control={accountControl}
                        render={({ field: { value, onChange, name } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              name={name}
                              label="Birthdate"
                              format="DD-MM-YYYY"
                              value={value ? dayjs(value) : dayjs("DD-MM-YYYY")}
                              onChange={onChange}
                              slotProps={{
                                textField: {
                                  error: accountErrors.account_dob?.message
                                    ? true
                                    : false,
                                  helperText: accountErrors.account_dob?.message
                                    ? `${accountErrors.account_dob.message}`
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
                        name="account_gender"
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
                              {accountErrors.account_gender?.message ? (
                                `${accountErrors.account_gender.message}`
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
                        name="account_email"
                        control={accountControl}
                        render={({ field: { value, onChange, name } }) => (
                          <TextField
                            label="Email"
                            placeholder="Enter email "
                            name={name}
                            value={"user@g.com"}
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

                    {/* Sign up Password */}
                    <div className="mb-2">
                      <div>
                        <Controller
                          name="account_password"
                          control={accountControl}
                          render={({ field: { value, onChange, name } }) => (
                            <TextField
                              type={accountPassEye ? "text" : "password"}
                              label="Password"
                              placeholder="Enter password "
                              name={name}
                              value={value}
                              disabled
                              onChange={onChange}
                              variant="outlined"
                              className="w-[400px]"
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setAccountPassEye(!accountPassEye)
                                        }
                                      >
                                        {accountPassEye ? (
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
                                accountErrors.account_password?.message
                                  ? true
                                  : false
                              }
                              helperText={
                                accountErrors.account_password?.message
                                  ? `${accountErrors.account_password.message}`
                                  : " "
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer"
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
                  </form>

                  <div className="p-4">
                    <p className="font-semibold mb-3">Delete Account:&nbsp;</p>

                    <button
                      type="button"
                      className="px-2.5 py-1.5 text-sm rounded-md bg-red-600 text-white font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default DefaultNavBar;
