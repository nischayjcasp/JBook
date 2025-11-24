"use client";

import jbookLogo from "@/app/favicon.ico";
import { Avatar, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

const DefaultNavBar = () => {
  const [userAccAnchor, setUserAccAnchor] = useState<null | HTMLElement>(null);
  const UserAcc = Boolean(userAccAnchor);
  const openUserAccMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserAccAnchor(event.currentTarget);
  };
  const closeUserAccMenu = () => {
    setUserAccAnchor(null);
  };

  const {
    control,
    formState: { errors },
  } = useForm();
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
            <MenuItem onClick={closeUserAccMenu}>
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
      </div>
    </div>
  );
};

export default DefaultNavBar;
