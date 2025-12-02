"use client";

import PostCard from "@/components/dashboard/PostCard";
import { Dialog, Pagination, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IoMdClose } from "react-icons/io";
import defaultImage from "@/app/assets/images/sampleImage.webp";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VisuallyHiddenInput } from "@/app/dashboard/layout";

const Dashboard = () => {
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const posts = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10,
  ];

  const [filteredPosts, setFilteredPosts] = useState<number[]>([]);
  const [pagination, setPagination] = useState<number>(1);
  const totalPagination = Math.ceil(posts.length / 9);

  useEffect(() => {
    setFilteredPosts(posts.slice(0, posts[9] ? 9 : undefined));
  }, []);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination(value);
    setFilteredPosts(
      posts.slice((value - 1) * 9, posts[value * 9] ? value * 9 : undefined)
    );
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSearch = (data: any) => {
    console.log(data);
  };

  const openEditDialog = () => {
    setEditDialog(true);
  };

  const closeEditDialog = () => {
    setEditDialog(false);
  };

  //Edit post form
  const {
    control: editPostControl,
    handleSubmit: editPostSubmit,
    formState: { errors: editPostErrors },
  } = useForm();

  const onEditPost = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-5 min-h-screen">
        {/* Search bar */}
        <div className="w-full bg-white py-5 sticky top-0 left-0 right-0">
          <form
            onSubmit={handleSubmit(onSearch)}
            className="mx-auto relative w-sm sm:w-lg lg:w-xl"
          >
            <input
              type="text"
              name="dash_search"
              className="w-xl px-3 py-1.5 border rounded-sm"
              placeholder="Search here.."
            />
            <button
              type="submit"
              className="absolute top-1/2 -translate-y-1/2 right-0 p-2 cursor-pointer"
            >
              <FaSearch className="text-xl" />
            </button>
          </form>
        </div>

        {/* List of post */}
        <div className="flex-1 inline-grid grid-cols-3 gap-5">
          {filteredPosts &&
            filteredPosts.map((posts, inx) => (
              <PostCard
                key={`user-post-${inx}`}
                openEditDialog={openEditDialog}
              />
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mb-5">
          <Pagination
            count={totalPagination}
            page={pagination}
            onChange={handlePagination}
            shape="rounded"
            size="large"
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#e1533c !important",
                color: "white",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "rgba(255,83,60,0.3)",
              },
            }}
          />
        </div>
      </div>

      {/* Edit post dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={editDialog}
        onClose={closeEditDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            overflow: "hidden",
          },
        }}
      >
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto hideScrollBar">
          <div className="z-10 sticky top-0 p-4 font-semibold bg-white border-b border-slate-200 flex justify-between">
            <p>Edit Post</p>
            <button
              type="button"
              onClick={closeEditDialog}
              className="cursor-pointer"
            >
              <IoMdClose className="text-2xl text-red-500" />
            </button>
          </div>

          <form className="w-full p-4" onSubmit={editPostSubmit(onEditPost)}>
            {/* Post date */}
            <div className="mb-2">
              <Controller
                name="post_date"
                control={editPostControl}
                render={({ field: { value, onChange, name } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name={name}
                      label="Birthdate"
                      format="DD-MM-YYYY"
                      value={value ? dayjs(value) : dayjs("dd-mm-yyyy")}
                      onChange={onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: editPostErrors.post_date?.message
                            ? true
                            : false,
                          helperText: editPostErrors.post_date?.message
                            ? `${editPostErrors.post_date.message}`
                            : " ",
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            {/* Post text */}
            <div className="mb-2">
              <Controller
                name="post_text"
                control={editPostControl}
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
                    error={editPostErrors.post_text?.message ? true : false}
                    helperText={
                      editPostErrors.post_text?.message
                        ? `${editPostErrors.post_text.message}`
                        : " "
                    }
                  />
                )}
              />
            </div>

            {/* Photo */}
            <div className="mb-7">
              <p className="font-semibold mb-2">Photo</p>
              <div className="flex justify-between items-start gap-10">
                <div>
                  <div className="flex gap-2">
                    <label>
                      <p className="inline-block px-2.5 py-1.5 text-sm rounded-md bg-primary text-white font-semibold cursor-pointer">
                        Choose photo
                      </p>
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => console.log(event.target.files)}
                      />
                    </label>
                  </div>
                  {/* <p className="text-red-500 text-sm px-3 py-1">Error</p> */}
                </div>
                <div className="flex-1">
                  <Image src={defaultImage} alt="Post image" className="" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-3 py-2 rounded-md bg-primary text-white font-semibold cursor-pointer"
              >
                Save Post
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default Dashboard;
