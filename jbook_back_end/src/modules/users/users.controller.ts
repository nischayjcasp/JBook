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
  @UseInterceptors(FileInterceptor("user_photo"))
  async updateUserCntr(
    @UploadedFile() user_photo: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Param("id") id: string
  ) {
    console.log("user_photo: ", user_photo);

    return this.usersService.updateUser(id, updateUserDto, user_photo);
  }

  @Delete("delete/:id")
  async deleteUserCntr(@Param("id") user_id: string) {
    if (!user_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    return this.usersService.deleteUser(user_id);
  }
}
