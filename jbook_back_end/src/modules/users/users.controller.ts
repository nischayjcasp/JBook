import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import type { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { DeleteUserDto } from "./dto/deleteUser.dto";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("fetch")
  async getUserCntr(@Req() req: Request, @Query("search") search: string) {
    return this.usersService.getUser(req.user?.user_id as string, search);
  }

  @Get("fetch/emails")
  async getUserEmailsCntr(
    @Req() req: Request,
    @Query("search") search: string
  ) {
    return this.usersService.getUserEmails(search);
  }

  @Get("fetch/:id")
  async getUserByIdCntr(@Param("id") user_id: string) {
    if (!user_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    return this.usersService.getUserById(user_id);
  }

  @Post("create")
  async createUserCntr(@Body() createUserDto: Partial<CreateUserDto>) {
    return this.usersService.createUser(createUserDto);
  }

  @Post("update/:id")
  @UseInterceptors(FileInterceptor("profile_photo"))
  async updateUserCntr(
    @UploadedFile() user_photo: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Param("id") id: string,
    @Req() req: Request
  ) {
    console.log("user_photo: ", user_photo);
    const session_id: string = req.cookies["MERGER_SESSION"];

    if (!session_id) {
      return {
        status: 401,
        message: "No active session",
      };
    }

    return this.usersService.updateUser(
      id,
      updateUserDto,
      session_id,
      user_photo
    );
  }

  @Post("delete/:id")
  async deleteUserCntr(
    @Param("id") user_id: string,
    @Body() deleteAccDto: DeleteUserDto,
    @Req() req: Request
  ) {
    if (!user_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    const session_id = req.cookies["MERGER_SESSION"];

    return this.usersService.deleteUser(deleteAccDto, user_id, session_id);
  }
}
