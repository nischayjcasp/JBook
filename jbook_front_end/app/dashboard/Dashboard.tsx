"use client";

import PostCard from "@/components/dashboard/PostCard";
import { CircularProgress, Dialog, Pagination, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IoMdClose } from "react-icons/io";
import defaultImage from "@/app/assets/images/sampleImage.webp";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VisuallyHiddenInput } from "@/app/dashboard/layout";
import {
  addPostSchema,
  userPhotoSupportedFormats,
} from "@/lib/schemas/settings.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const posts = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10,
  ];
  const [PostPhoto, setPostPhoto] = useState<string | null>(null);
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
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSearch = (data: any) => {
    console.log(data);
  };

  //Edit post form
  const {
    control: editPostControl,
    handleSubmit: editPostSubmit,
    watch: postWatch,
    reset: editPostReset,
    formState: { errors: editPostErrors },
  } = useForm({
    resolver: yupResolver(addPostSchema),
    defaultValues: {
      post_date: new Date("2025-12-04"),
      post_text: "SitaRAM",
    },
  });

  const postPhoto: any = postWatch("post_photo");

  useEffect(() => {
    if (postPhoto && userPhotoSupportedFormats.includes(postPhoto.type)) {
      const photoUrl = URL.createObjectURL(postPhoto);
      console.log("photoUrl", photoUrl);
      setPostPhoto(photoUrl);
    } else setPostPhoto(null);
  }, [postPhoto]);

  const openEditDialog = () => {
    setEditDialog(true);
  };

  const closeEditDialog = () => {
    if (!isLoading) {
      setEditDialog(false);
      editPostReset();
    }
  };

  const onEditPost = async (data: any) => {
    console.log(data);
    setLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        setLoading(false);
        toast.success("Post saved successfully.");
        closeEditDialog();
        resolve("done");
      }, 5000);
    });
  };

  //handle Post serach
  const handlePostSearch = () => {};

  return (
    <>
      <div
        className="w-full flex flex-col gap-5 max-h-screen overflow-y-auto"
        ref={pageRef}
      >
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
              onChange={handlePostSearch}
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
        <div className={`px-16 flex-1 inline-grid grid-cols-3 gap-5`}>
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

      {/* Edit Post Dialog */}
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

          {/* Headers */}
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

          {/* Edit Post Form */}
          <form className="w-full p-4" onSubmit={editPostSubmit(onEditPost)}>
            {/* Post date */}
            <div className="mb-2">
              <Controller
                name="post_date"
                control={editPostControl}
                render={({ field: { value, onChange, name } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      name={name}
                      label="Birthdate"
                      format="DD-MM-YYYY HH:MM A"
                      value={value ? dayjs(value) : dayjs("")}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
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
            <div className="flex flex-col gap-2 mb-7">
              <div className="flex flex-col">
                <div className="flex  items-center gap-5 mb-2">
                  <p className="font-semibold">Photo</p>
                  <Controller
                    name="post_photo"
                    control={editPostControl}
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
                  {editPostErrors.post_photo
                    ? editPostErrors.post_photo?.message
                    : " "}
                </p>
              </div>

              <div className="flex-1 mx-auto border border-slate-300 rounded-lg">
                <Image
                  src={
                    !editPostErrors.post_photo?.message && PostPhoto
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
                Edit Post
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default Dashboard;
