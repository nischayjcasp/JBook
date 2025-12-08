import Image, { StaticImageData } from "next/image";
import React from "react";

const MergerPostCard = ({
  postDate,
  postText,
  postImage,
}: {
  postDate: Date;
  postText: string;
  postImage: StaticImageData;
}) => {
  return (
    <div
      className="w-full min-h-[300px] flex gap-4 border border-slate-300 p-4 rounded-md"
      style={{
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
      }}
    >
      <div className="w-3/5 flex flex-col">
        <p className="mb-2">
          <span className="font-semibold">Date: </span>
          {postDate.toLocaleString()}
        </p>
        <p className="text-base text-justify">
          <span className="font-semibold">Text: </span>
          {postText}
        </p>
      </div>
      <div className="w-2/5">
        <Image
          src={postImage}
          alt="post photo"
          className="w-full h-full max-w-60 max-h-[280px] rounded-md"
        />
      </div>
    </div>
  );
};

export default MergerPostCard;
