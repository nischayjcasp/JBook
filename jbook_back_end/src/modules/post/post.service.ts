import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>
  ) {}

  async getPostById(post_id: string) {
    try {
      // Check if user already registered?
      const findPost = await this.postsRepo.findOne({
        where: { id: post_id },
      });

      if (!findPost) {
        return {
          status: 400,
          message: "Post do not found",
        };
      }

      return {
        status: 200,
        message: "Fetched post successfully",
        user: findPost,
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        message: "Error occured during fetching the post.",
        error_message: error.message,
      };
    }
  }

  async getAllPost(user_id: string) {
    try {
      // Check if user already registered?
      const findPosts = await this.postsRepo.find({
        where: { user_id },
      });

      return {
        status: 200,
        message: findPosts ? "Fetched Users successfully" : "No users found",
        user: findPosts ?? [],
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        message: "Error occured during fetching the posts.",
        error_message: error.message,
      };
    }
  }

  async createUser(createPostDto: CreatePostDto) {
    try {
      let tempPostData = this.postsRepo.create();

      // Creating new post
      tempPostData.post_title = createPostDto.post_title;
      tempPostData.post_title = createPostDto.post_title;
      tempPostData.post_text = createPostDto.post_text;
      tempPostData.post_image = createPostDto.post_image;
      tempPostData.user_id = createPostDto.user_id;

      console.log("tempPostData: ", tempPostData);

      let createPostRes = await this.postsRepo.save(tempPostData);

      if (!createPostRes) {
        return {
          status: 500,
          message: "Error occured during creating the post.",
        };
      }
      return {
        status: 201,
        message: "Post created successfully",
        user: createPostRes,
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        message: "Error occured during creating the post.",
        error_message: error.message,
      };
    }
  }

  async updateUser(post_id: string, updatePostDto: UpdatePostDto) {
    post_id;
    try {
      // Check if user already registered?
      const findPost = await this.postsRepo.findOne({
        where: { id: post_id },
      });

      if (!findPost) {
        return {
          status: 400,
          message: "Post do not found.",
        };
      }

      // Clearing the updatePostDto from null | undefined values
      for (let key of Object.keys(updatePostDto)) {
        if (!updatePostDto[key]) {
          delete updatePostDto[key];
        }
      }

      console.log("updatePostDto: ", updatePostDto);

      const updatedPostData = Object.assign(findPost, updatePostDto);

      console.log("updatedUserData: ", updatedPostData);

      // Updating new user
      let updateUserRes = await this.postsRepo.save(updatedPostData);
      if (!updateUserRes) {
        return {
          status: 500,
          message: "Error occured during updating the post.",
        };
      }
      return {
        status: 200,
        message: "Post updated successfully",
        user: updateUserRes,
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        message: "Error occured during updating the post.",
        error_message: error.message,
      };
    }
  }
  async deleteUser(post_id: string) {
    try {
      // Check if user already registered?
      const findUser = await this.postsRepo.findOne({
        where: { id: post_id },
      });
      if (!findUser) {
        return {
          status: 400,
          message: "Post do not found.",
        };
      }
      // deleting user
      let deleteUserRes = await this.postsRepo.delete({ id: post_id });
      if (!deleteUserRes) {
        return {
          status: 500,
          message: "Error occured during deleting the post.",
        };
      }
      return {
        status: 200,
        message: "Post deleted successfully",
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        message: "Error occured during deleting the post.",
        error_message: error.message,
      };
    }
  }
}
