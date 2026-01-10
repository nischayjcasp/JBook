"use client";

import defaultImage from "@/app/assets/images/default-placeholder.jpg";
import Image from "next/image";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PostData } from "@/services/post.type";
import { CircularProgress } from "@mui/material";
import { deletePostByIdAPI } from "@/services/post.service";
import { setEditPostDialog } from "@/redux/slices/dialogSlice";

interface PostCardProps {
  data: PostData;
}

const PostCard = ({ data }: PostCardProps) => {
  const dispatch = useDispatch();
  const isMerging = useSelector(
    (state: RootState) => state.merger.mergingProgress.isMerging
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  const handelPostDelete = async (post_id: string) => {
    console.log("post_id: ", post_id);

    console.log(data);

    try {
      setLoading(true);

      const deletePostRes = await deletePostByIdAPI(post_id);

      console.log("deletePostRes: ", deletePostRes);

      if (deletePostRes.status === 200) {
        toast.success(deletePostRes.message);
        window.location.reload();
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

  return (
    <Link
      href={`dashboard/post/${data.id}`}
      className="relative min-w-0 block w-full max-h-[410px] p-4 rounded-md border border-slate-200"
      style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* Loader */}
      {isLoading && (
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

      {/* Post div */}
      <div className="max-h-[400px] h-full flex flex-col justify-between gap-4 min-w-0">
        {/* Posted Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-lg text-left">{data.post_title}</p>
            <p className="text-sm text-left text-black/60">
              {new Date(data.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              disabled={isMerging}
              className="p-2 cursor-pointer disabled:cursor-not-allowed text-primary disabled:text-slate-300 rounded-sm flex items-center gap-1"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                dispatch(
                  setEditPostDialog({
                    status: true,
                    post_id: data.id,
                  })
                );
              }}
            >
              <FaEdit className="text-lg" />
            </button>

            <button
              disabled={isMerging}
              type="button"
              className="p-2 cursor-pointer disabled:cursor-not-allowed text-red-600 disabled:text-slate-300 rounded-sm flex items-center gap-1"
              onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();

                await handelPostDelete(data.id);
              }}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {/* Post Text */}
        <p className="text-left min-h-18">
          {data.post_text.slice(0, 100)}
          <span>...</span>
          <span className="mx-1 text-blue-600">more</span>
        </p>

        <div className="flex-1 min-w-0 max-w-full max-h-56">
          <Image
            src={data.post_image ?? defaultImage}
            alt="User post image"
            width={200}
            height={200}
            className="w-full h-full object-fill block"
          />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
