"use client";

import ViewPost from "./ViewPost";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = useParams();
  const initialPostData = {
    postId: id as string,
    userName: "Ram",
    postDate: "12/18/2025",
    postText: `
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam
    in porro? Temporibus minus, dolores aut, tempore, quos adipisci
    voluptatibus cum accusamus commodi corrupti necessitatibus amet ea
    architecto possimus placeat.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam
    in porro? Temporibus minus, dolores aut, tempore, quos adipisci
    voluptatibus cum accusamus commodi corrupti necessitatibus amet ea
    architecto possimus placeat.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam
    in porro? Temporibus minus, dolores aut, tempore, quos adipisci
    voluptatibus cum accusamus commodi corrupti necessitatibus amet ea
    architecto possimus placeat.
    `,
    postImage:
      "https://res.cloudinary.com/db4tgdwj6/image/upload/v1757070817/NI_Experience_Admin/Packages/68b6bdadd819e4a5ce28b441/vsnfujvqdtg8r7uznn8s.webp",
  };
  const [postData, setPostData] = useState(initialPostData);

  return <ViewPost data={postData} />;
};

export default Page;
