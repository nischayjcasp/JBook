import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { ILike, Like, Repository } from "typeorm";
import { v2 as cloudinary } from "cloudinary";
import { UploadLog, UploadStatus } from "./entities/uploadLog.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    @InjectRepository(UploadLog)
    private readonly uploadLogRepo: Repository<UploadLog>
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

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
        post: findPost,
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

  async getAllPost(user_id: string, searchText: string) {
    try {
      let findPosts: Post[];

      // Check if user already registered?
      if (searchText) {
        findPosts = await this.postsRepo.find({
          where: [
            {
              user_id,
              post_title: ILike(`%${searchText}%`),
            },
            {
              user_id,
              post_text: ILike(`%${searchText}%`),
            },
          ],
        });
      } else {
        findPosts = await this.postsRepo.find({
          where: {
            user_id,
          },
        });
      }

      return {
        status: 200,
        message:
          findPosts.length > 0
            ? "Fetched posts successfully"
            : "No posts found",
        posts: findPosts.length > 0 ? findPosts : [],
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

  async createPost(
    user_id: string,
    createPostDto: CreatePostDto,
    post_photo: Express.Multer.File
  ) {
    let uploadPostImage: any, uploadLogData: any;

    try {
      // uploading the image
      if (post_photo) {
        const imageBuffer = post_photo.buffer.toString("base64");

        const postImageUri = `data:${post_photo.mimetype};base64,${imageBuffer}`;

        uploadPostImage = await cloudinary.uploader.upload(postImageUri, {
          unique_filename: true,
          overwrite: true,
          folder: `MergerApp/posts/${user_id}`,
        });

        console.log("uploadPostImage: ", uploadPostImage);

        if (!uploadPostImage || !uploadPostImage.asset_id) {
          return {
            status: 500,
            message: "Error occured during uploading the post image.",
          };
        }

        //create upload log
        const tempUploadLogData = this.uploadLogRepo.create();

        tempUploadLogData.status = UploadStatus.UPLOADED;
        tempUploadLogData.post_id = null;
        tempUploadLogData.asset_id = uploadPostImage?.asset_id;
        tempUploadLogData.public_id = uploadPostImage?.public_id;
        tempUploadLogData.signature = uploadPostImage?.signature;
        tempUploadLogData.asset_folder = uploadPostImage?.asset_folder;
        tempUploadLogData.file_name =
          uploadPostImage?.display_name + "." + uploadPostImage?.format;
        tempUploadLogData.resource_type = uploadPostImage?.resource_type;
        tempUploadLogData.secure_url = uploadPostImage?.secure_url;
        tempUploadLogData.bytes = uploadPostImage?.bytes;
        tempUploadLogData.uploaded_at = new Date(uploadPostImage?.created_at);

        uploadLogData = await this.uploadLogRepo.save(tempUploadLogData);

        if (!uploadLogData) {
          return {
            status: 500,
            message: "Error occured during creating the upload log.",
          };
        }
      }

      // Creating new post
      let tempPostData = this.postsRepo.create();
      tempPostData.post_title = createPostDto.post_title;
      tempPostData.post_text = createPostDto.post_text;
      tempPostData.post_image = uploadPostImage
        ? uploadPostImage.secure_url
        : null;
      tempPostData.user_id = user_id;

      console.log("tempPostData: ", tempPostData);

      let createPostRes = await this.postsRepo.save(tempPostData);

      if (!createPostRes) {
        return {
          status: 500,
          message: "Error occured during creating the post.",
        };
      }

      // Update upload log
      if (post_photo) {
        const findUploadLog = await this.uploadLogRepo.findOne({
          where: {
            id: uploadLogData.id,
          },
        });

        if (!findUploadLog) {
          return {
            status: 500,
            message: "Upload log do not found",
          };
        }

        console.log("findUploadLog: ", findUploadLog);

        const updatedUploadLog = {
          ...findUploadLog,
          post_id: createPostRes.id as string,
        };

        console.log("updatedUploadLog: ", updatedUploadLog);

        let updateUploadLogRes =
          await this.uploadLogRepo.save(updatedUploadLog);

        console.log("updateUploadLogRes: ", updateUploadLogRes);

        if (!updateUploadLogRes) {
          return {
            status: 500,
            message: "Error occured during updating the upload log.",
          };
        }
      }

      //successful post created
      return {
        status: 201,
        message: "Post created successfully",
        user: createPostRes,
      };
    } catch (error) {
      console.log("Error: ", error.message);

      return {
        status: 500,
        message: "Error occurred while uploading the image",
        error_message: error.message,
      };
    }
  }

  async updatePost(
    post_id: string,
    updatePostDto: UpdatePostDto,
    post_photo: Express.Multer.File
  ) {
    try {
      // Check if post exist
      const findPost = await this.postsRepo.findOne({
        where: { id: post_id },
      });

      if (!findPost) {
        return {
          status: 400,
          message: "Post do not found.",
        };
      }

      // upload image if post_photo exist
      if (post_photo) {
        const imageBuffer = post_photo.buffer.toString("base64");

        const postImageUri = `data:${post_photo.mimetype};base64,${imageBuffer}`;

        const uploadPostImage = await cloudinary.uploader.upload(postImageUri, {
          unique_filename: true,
          overwrite: true,
          folder: `MergerApp/posts/${findPost.user_id}`,
        });

        console.log("uploadPostImage: ", uploadPostImage);

        if (!uploadPostImage || !uploadPostImage.asset_id) {
          return {
            status: 500,
            message: "Error occured during uploading the post image.",
          };
        }

        findPost.post_image = uploadPostImage.secure_url;

        //create upload log
        const tempUploadLogData = this.uploadLogRepo.create();

        tempUploadLogData.status = UploadStatus.UPLOADED;
        tempUploadLogData.post_id = findPost.id;
        tempUploadLogData.asset_id = uploadPostImage?.asset_id;
        tempUploadLogData.public_id = uploadPostImage?.public_id;
        tempUploadLogData.signature = uploadPostImage?.signature;
        tempUploadLogData.asset_folder = uploadPostImage?.asset_folder;
        tempUploadLogData.file_name =
          uploadPostImage?.display_name + "." + uploadPostImage?.format;
        tempUploadLogData.resource_type = uploadPostImage?.resource_type;
        tempUploadLogData.secure_url = uploadPostImage?.secure_url;
        tempUploadLogData.bytes = uploadPostImage?.bytes;
        tempUploadLogData.uploaded_at = new Date(uploadPostImage?.created_at);

        const uploadLogData = await this.uploadLogRepo.save(tempUploadLogData);

        if (!uploadLogData) {
          return {
            status: 500,
            message: "Error occured during creating the upload log.",
          };
        }
      }

      // Clearing the updatePostDto from null | undefined values
      for (let key of Object.keys(updatePostDto)) {
        if (!updatePostDto[key]) {
          delete updatePostDto[key];
        }
      }

      console.log("updatePostDto: ", updatePostDto);

      const updatedPostData = { ...findPost, ...updatePostDto };

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

  async deletePost(post_id: string) {
    try {
      // Check if post exits
      const findPost = await this.postsRepo.findOne({
        where: { id: post_id },
      });

      if (!findPost) {
        return {
          status: 400,
          message: "Post do not found.",
        };
      }

      // deleting post
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
