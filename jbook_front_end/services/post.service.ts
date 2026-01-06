import API from "@/lib/api";
import { PostData } from "./post.type";

export const fetchPostAllAPI = (): Promise<{
  status: number;
  message: string;
  posts: PostData[];
}> => {
  return API.get(`/post/fetch/all`);
};

export const fetchPostByIdAPI = (
  post_id: string
): Promise<{
  status: number;
  message: string;
  post: PostData;
}> => {
  return API.get(`/post/fetch/${post_id}`);
};

export const createPostAPI = (
  createPostPayload: FormData
): Promise<{
  status: number;
  message: string;
  posts: any;
}> => {
  return API.post(`/post/create`, createPostPayload);
};

export const updatePostAPI = (
  post_id: string,
  updatePostPayload: FormData
): Promise<{
  status: number;
  message: string;
  posts: any;
}> => {
  return API.post(`/post/update/${post_id}`, updatePostPayload);
};

export const deletePostByIdAPI = (
  post_id: string
): Promise<{
  status: number;
  message: string;
}> => {
  return API.delete(`/post/delete/${post_id}`);
};
