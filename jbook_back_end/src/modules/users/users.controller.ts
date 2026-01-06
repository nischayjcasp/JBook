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
  async getUserCntr(@Req() req: Request) {
    return await this.usersService.getUser(req.user?.user_id as string);
  }

  @Get("fetch/:id")
  async getUserByIdCntr(@Param("id") user_id: string) {
    if (!user_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    return await this.usersService.getUserById(user_id);
  }

  @Get("fetch/all")
  async findUserByEmailCntr(@Query("search") text: string) {
    return await this.usersService.findUserByEmail(text);
  }

  @Post("create")
  async createUserCntr(@Body() createUserDto: Partial<CreateUserDto>) {
    return await this.usersService.createUser(createUserDto);
  }

  @Post("update/:id")
  @UseInterceptors(FileInterceptor("user_photo"))
  async updateUserCntr(
    @UploadedFile() user_photo: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Param("id") id: string
  ) {
    console.log("user_photo: ", user_photo);

    return await this.usersService.updateUser(id, updateUserDto, user_photo);
  }

  @Delete("delete/:id")
  async deleteUserCntr(@Param("id") user_id: string) {
    if (!user_id) {
      return {
        status: 400,
        message: "User id required!",
      };
    }

    return await this.usersService.deleteUser(user_id);
  }
}
