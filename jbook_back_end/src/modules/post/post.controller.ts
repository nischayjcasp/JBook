import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import type { Request } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get("fetch/all")
  async getAllPostCntr(
    @Req() req: Request,
    @Query("search") searchText: string
  ) {
    return await this.postService.getAllPost(
      req.user?.user_id as string,
      searchText
    );
  }

  @Get("fetch/:id")
  async getPostByIdCntr(@Param("id") post_id: string) {
    if (!post_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    return await this.postService.getPostById(post_id);
  }

  @Post("create")
  @UseInterceptors(FileInterceptor("post_photo"))
  async createPostCntr(
    @UploadedFile() post_photo: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request
  ) {
    console.log("post_photo: ", post_photo);

    return await this.postService.createPost(
      req.user?.user_id as string,
      createPostDto,
      post_photo
    );
  }

  @Post("update/:id")
  @UseInterceptors(FileInterceptor("post_photo"))
  async updatePostCntr(
    @UploadedFile() post_photo: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
    @Param("id") id: string
  ) {
    console.log("post_photo: ", post_photo);

    return await this.postService.updatePost(id, updatePostDto, post_photo);
  }

  @Delete("delete/:id")
  async deletePostCntr(@Param("id") post_id: string) {
    if (!post_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    return await this.postService.deletePost(post_id);
  }
}
