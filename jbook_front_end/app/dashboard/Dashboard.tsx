"use client";

import PostCard from "@/components/dashboard/PostCard";
import { CircularProgress, Dialog, Pagination, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import defaultImage from "@/app/assets/images/default-placeholder.jpg";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { VisuallyHiddenInput } from "@/app/dashboard/layout";
import {
  addPostSchema,
  AddPostSchemaType,
  userPhotoSupportedFormats,
} from "@/lib/schemas/settings.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { fetchUserAPI, fetchUserData } from "@/services/user.serivce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserdata } from "@/redux/slices/userSlice";
import {
  fetchPostAllAPI,
  fetchPostByIdAPI,
  updatePostAPI,
} from "@/services/post.service";
import { PostData } from "@/services/post.type";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFetchingPost, setIsFetchingPost] = useState<boolean>(true);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [editDialog, setEditDialog] = useState<{
    status: boolean;
    post_id: string;
  }>({
    status: false,
    post_id: "",
  });
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [PostPhoto, setPostPhoto] = useState<string | StaticImageData | null>(
    defaultImage
  );
  const [pagination, setPagination] = useState<number>(1);
  const totalPagination = Math.ceil(posts.length / 9);
  const userData = useSelector((state: RootState) => state.user.userData);

  const fetchUserPostsData = async () => {
    try {
      const postDataRes = await fetchPostAllAPI();

      console.log("postDataRes: ", postDataRes);

      if (postDataRes && postDataRes.status === 200) {
        setPosts(postDataRes.posts);
        setFilteredPosts(postDataRes.posts.slice(0, 9));
        // toast.success(postDataRes.message);
      } else {
        toast.error(postDataRes.message ?? "Something went wrong!");
      }
    } catch (error: unknown) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setIsFetchingPost(false);
    }
  };

  // Fetch data
  useEffect(() => {
    fetchUserData();
    fetchUserPostsData();
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
    setValue: editPostSetValue,
    formState: { errors: editPostErrors },
  } = useForm({
    resolver: yupResolver(addPostSchema),
    defaultValues: {
      post_title: "",
      post_text: "",
      post_photo: null,
    },
  });

  const postPhoto: any = postWatch("post_photo");

  useEffect(() => {
    if (postPhoto && userPhotoSupportedFormats.includes(postPhoto.type)) {
      const photoUrl = URL.createObjectURL(postPhoto);
      console.log("photoUrl", photoUrl);
      setPostPhoto(photoUrl);
    }
  }, [postPhoto]);

  const openEditDialog = async (post_id: string) => {
    setEditDialog({ status: true, post_id });
    setLoading(true);
    console.log("post_id: ", post_id);

    // fetch the post data
    try {
      const fetchPostByIdRes = await fetchPostByIdAPI(post_id);

      console.log("fetchPostByIdRes: ", fetchPostByIdRes);

      if (fetchPostByIdRes.status === 200) {
        editPostSetValue("post_title", fetchPostByIdRes.post.post_title);
        editPostSetValue("post_text", fetchPostByIdRes.post.post_text);

        if (fetchPostByIdRes.post.post_image) {
          setPostPhoto(fetchPostByIdRes.post.post_image);
        }
      } else {
        toast.error(fetchPostByIdRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeEditDialog = () => {
    if (!isLoading) {
      setEditDialog({ status: false, post_id: "" });
      editPostReset();
      setPostPhoto(defaultImage);
    }
  };

  const onEditPost = async (data: AddPostSchemaType) => {
    console.log(data);
    setLoading(true);

    try {
      let updatePostData = new FormData();
      updatePostData.append("post_title", data.post_title);
      updatePostData.append("post_text", data.post_text);
      if (data.post_photo) {
        updatePostData.append("post_photo", data.post_photo as File);
      }
      const updatePostRes = await updatePostAPI(
        editDialog.post_id,
        updatePostData
      );
      console.log("updatePostRes: ", updatePostRes);
      if (updatePostRes.status === 200) {
        toast.success(updatePostRes.message);
        closeEditDialog();
        window.location.reload();
      } else {
        toast.error(updatePostRes.message);
      }
    } catch (error: unknown) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //handle Post serach
  const handlePostSearch = () => {};

  return (
    <>
      <div
        className="w-full h-full flex flex-col gap-5 max-h-screen overflow-y-auto"
        ref={pageRef}
      >
        {/* Search bar */}
        <div className="w-full bg-white py-5 sticky top-0 left-0 right-0 z-10 shadow-sm">
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
        <div className="relative px-16 flex-1 grid grid-cols-3 auto-rows-fr gap-5">
          {isFetchingPost && (
            <div className="absolute inset-0 z-10 flex justify-center items-center">
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

          {filteredPosts &&
            !isFetchingPost &&
            filteredPosts.map((post, inx) => (
              <PostCard
                key={`user-post-${inx}`}
                openEditDialog={openEditDialog}
                data={post}
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
        open={editDialog.status}
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
            {/* Post title */}
            <div className="mb-2">
              <Controller
                name="post_title"
                control={editPostControl}
                render={({ field: { value, onChange, name } }) => (
                  <TextField
                    label="Post title"
                    placeholder="Enter post title"
                    name={name}
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    className="w-full"
                    error={editPostErrors.post_title?.message ? true : false}
                    helperText={
                      editPostErrors.post_title?.message
                        ? `${editPostErrors.post_title.message}`
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
                    render={({ field: { name, onChange } }) => (
                      <label>
                        <p className="inline-block px-2.5 py-1.5 text-sm rounded-md bg-primary text-white text-nowrap font-semibold cursor-pointer">
                          Choose photo
                        </p>
                        <VisuallyHiddenInput
                          type="file"
                          name={name}
                          onChange={(event) => {
                            if (event.target.files) {
                              onChange(event.target.files[0]);
                            }
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

              <div className="relative w-full h-[300px] max-h-[300px] mx-auto border border-slate-300 rounded-lg">
                {PostPhoto ? (
                  <Image
                    src={PostPhoto}
                    alt="Post image"
                    width={500}
                    height={300}
                    className="w-full h-auto max-h-[300px] rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 z-10 flex justify-center items-center">
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
