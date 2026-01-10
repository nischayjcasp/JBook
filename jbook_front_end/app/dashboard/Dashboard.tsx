"use client";

import PostCard from "@/components/dashboard/PostCard";
import { CircularProgress, Dialog, Pagination, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { fetchPostAllAPI } from "@/services/post.service";
import { PostData } from "@/services/post.type";

const Dashboard = () => {
  const dispatch = useDispatch();
  const searchPostInputRef = useRef<HTMLInputElement | null>(null);
  const [isFetchingPost, setIsFetchingPost] = useState<boolean>(true);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [pagination, setPagination] = useState<number>(1);
  const totalPagination = Math.ceil(posts.length / 9);
  const userData = useSelector((state: RootState) => state.user.userData);
  let postSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Post search
  const handlePostSearch = async (text: string) => {
    console.log("text: ", text);
    setIsFetchingPost(true);
    try {
      const fetchPostRes = await fetchPostAllAPI(text);

      console.log("fetchPostRes: ", fetchPostRes);

      setFilteredPosts([...fetchPostRes.posts]);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setTimeout(() => {
        setIsFetchingPost(false);
      }, 300);
    }
  };

  return (
    <>
      <div
        className="w-full h-full flex flex-col gap-5 max-h-screen overflow-y-auto"
        ref={pageRef}
      >
        {/* Search bar */}
        <div className="w-full bg-white py-5 sticky top-0 left-0 right-0 z-10 shadow-sm">
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (searchPostInputRef.current) {
                handlePostSearch(searchPostInputRef.current.value);
              }
            }}
            className="mx-auto relative w-sm sm:w-lg lg:w-xl"
          >
            <input
              type="text"
              name="dash_search"
              ref={searchPostInputRef}
              className="w-xl px-3 py-1.5 border rounded-sm"
              placeholder="Search here.."
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!searchPostInputRef.current) return;

                if (postSearchTimer.current) {
                  clearTimeout(postSearchTimer.current);
                }
                postSearchTimer.current = setTimeout(() => {
                  handlePostSearch(searchPostInputRef.current?.value as string);
                  postSearchTimer.current = null;
                }, 300);
              }}
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
        <div className="relative px-16 flex-1">
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

          <div className="grid grid-cols-3 auto-rows-fr gap-5">
            {filteredPosts &&
              !isFetchingPost &&
              filteredPosts.map((post, inx) => (
                <PostCard key={`user-post-${inx}`} data={post} />
              ))}
          </div>

          {filteredPosts && filteredPosts.length <= 0 && !isFetchingPost && (
            <p className="py-5 text-center text-red-500 text-xl">
              No post found.
            </p>
          )}
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
    </>
  );
};

export default Dashboard;
