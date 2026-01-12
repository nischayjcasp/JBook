"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { deletePostByIdAPI, fetchPostByIdAPI } from "@/services/post.service";
import { PostData } from "@/services/post.type";
import { CircularProgress } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { setEditPostDialog } from "@/redux/slices/dialogSlice";

const ViewPost = ({ id }: { id: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMerging = useSelector(
    (state: RootState) => state.merger.mergingProgress.isMerging
  );
  const sideBar = useSelector(
    (state: RootState) => state.dialogs.layoutSidebar
  );

  const [isLoading, setLoading] = useState<boolean>(true);
  const [postData, setPostData] = useState<PostData>();

  const openEditDialog = () => {
    dispatch(setEditPostDialog({ status: true, post_id: id }));
  };

  const closeEditDialog = () => {
    dispatch(setEditPostDialog({ status: false, post_id: "" }));
  };

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const postRes = await fetchPostByIdAPI(id);

      console.log("postRes: ", postRes);

      if (postRes.status === 200) {
        setPostData(postRes.post);
      } else {
        throw new Error(postRes.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      let err = error as { message: string };
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handelPostDelete = async () => {
    try {
      setLoading(true);

      const deletePostRes = await deletePostByIdAPI(id);

      console.log("deletePostRes: ", deletePostRes);

      if (deletePostRes.status === 200) {
        toast.success(deletePostRes.message);
        router.replace("/dashboard");
      } else {
        toast.error(deletePostRes.message);
      }
    } catch (error: unknown) {
      console.log("Error: ", error);
      const err = error as { message: string };
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, []);

  return (
    <div
      className={`relative py-7 min-h-screen overflow-y-auto ${
        sideBar ? "px-24" : "px-30"
      }`}
    >
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 h-full w-full z-1500 bg-white flex items-center justify-center">
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

      {postData ? (
        <>
          <div className="mb-4">
            {/* Back arrow */}
            <button
              type="button"
              className={`text-black text-[22px] p-2 absolute top-4 left-0 cursor-pointer duration-300 ${
                sideBar ? "left-4" : "left-16"
              }`}
              onClick={() => router.push("/dashboard")}
            >
              <FaArrowLeft />
            </button>

            {/* Posted Title */}
            <p className="font-semibold text-lg text-left">
              {postData.post_title}
            </p>
            <p className="text-sm text-left text-black/60">
              {new Date(postData.created_at).toLocaleString()}
            </p>
          </div>

          {/* Post Text */}
          <p className="text-left mb-7">{postData.post_text}</p>

          <Image
            src={postData.post_image}
            alt="User post image"
            width={500}
            height={500}
            className="flex-1 mx-auto w-[500px] h-[400px] mb-10"
          />

          <div className="flex justify-center items-center gap-4">
            <button
              type="button"
              disabled={isMerging}
              className="py-2 px-5 cursor-pointer disabled:cursor-not-allowed bg-primary/90 hover:bg-primary text-white disabled:bg-slate-300 rounded-sm flex items-center gap-1"
              onClick={openEditDialog}
            >
              Edit
            </button>

            <button
              disabled={isMerging}
              type="button"
              className="py-2 px-5 cursor-pointer disabled:cursor-not-allowed bg-red-500 hover:bg-red-600 text-white disabled:bg-slate-300 rounded-sm flex items-center gap-1"
              onClick={handelPostDelete}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-xl py-7 text-red-500">No post found</p>
      )}
    </div>
  );
};

export default ViewPost;
