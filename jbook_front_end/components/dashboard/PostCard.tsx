"use client";

import defaultImage from "@/app/assets/images/sampleImage.webp";
import Image from "next/image";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";

interface PostCardProps {
  openEditDialog: () => void;
}

const PostCard = ({ openEditDialog }: PostCardProps) => {
  return (
    <Link
      href="dashboard/post/1"
      className="w-full max-h-[370px] p-4 rounded-md border border-slate-200"
      style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* Posted by */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-lg text-left">User name</p>
          <p className="text-sm text-left text-black/60">
            {new Date().toLocaleString()}
          </p>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            className="p-2 cursor-pointer text-primary rounded-sm flex items-center gap-1"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              openEditDialog();
            }}
          >
            <FaEdit className="text-lg" />
          </button>

          <button
            type="button"
            className="p-2 cursor-pointer text-red-600 rounded-sm flex items-center gap-1"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              toast.success("Post deleted successfully.");
            }}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-left mb-4">
        {`Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam
        in porro? Temporibus minus, dolores aut, tempore, quos adipisci
        voluptatibus cum accusamus commodi corrupti necessitatibus amet ea
        architecto possimus placeat.`.slice(0, 100)}
        <span>...</span>
        <span className="mx-1 text-blue-600">more</span>
      </p>

      <Image src={defaultImage} alt="User post image" className="w-full" />
    </Link>
  );
};

export default PostCard;
