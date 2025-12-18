"use client";

import { CircularProgress, Dialog, Pagination, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
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
import { VisuallyHiddenInput } from "@/app/dashboard/layout";
import {
  addPostSchema,
  userPhotoSupportedFormats,
} from "@/src/lib/schemas/settings.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

interface ViewPostProps {
  postId: string;
  userName: string;
  postDate: string;
  postText: string;
  postImage: string;
}

const ViewPost = ({ data }: { data: ViewPostProps }) => {
  const { postId, userName, postDate, postText, postImage } = data;
  const isMerging = useSelector(
    (state: RootState) => state.merger.mergingProgress.isMerging
  );

  const [isLoading, setLoading] = useState<boolean>(false);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [PostPhoto, setPostPhoto] = useState<string | null>(null);

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

  return (
    <>
      <div className="px-24 py-7 max-h-screen overflow-y-auto">
        <p className="text-2xl font-semibold mb-5">Post: {postId}</p>

        {/* Posted by */}
        <div className="mb-4">
          <p className="font-semibold text-lg text-left">{userName}</p>
          <p className="text-sm text-left text-black/60">
            {new Date(postDate).toLocaleString()}
          </p>
        </div>

        {/* Post Text */}
        <p className="text-left mb-7">{postText}</p>

        <Image
          src={postImage}
          alt="User post image"
          width={500}
          height={500}
          className="flex-1 mx-auto w-[500px] h-[400px] mb-10"
        />

        <div className="flex justify-center items-center gap-4">
          <button
            type="button"
            disabled={isMerging}
            className="py-2 px-5 cursor-pointer disabled:cursor-not-allowed bg-primary text-white disabled:bg-slate-300 rounded-sm flex items-center gap-1"
            onClick={() => {
              openEditDialog();
            }}
          >
            Edit
          </button>

          <button
            disabled={isMerging}
            type="button"
            className="py-2 px-5 cursor-pointer disabled:cursor-not-allowed bg-red-600 text-white disabled:bg-slate-300 rounded-sm flex items-center gap-1"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              toast.success("Post deleted successfully.");
            }}
          >
            Delete
          </button>
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

export default ViewPost;
