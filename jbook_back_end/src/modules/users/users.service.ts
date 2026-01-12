import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { ILike, Like, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  SessionStatus,
  UserSession,
} from "../session/entities/user_session.entity";
import { v2 as cloudinary } from "cloudinary";
import { UploadLog, UploadStatus } from "../post/entities/uploadLog.entity";
import { DeleteUserLog } from "./entities/deleteUserLog.entity";
import { DeleteUserDto } from "./dto/deleteUser.dto";
import { SessionService } from "../session/session.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(UploadLog)
    private readonly uploadLogRepo: Repository<UploadLog>,
    @InjectRepository(DeleteUserLog)
    private readonly delteAccLogRepo: Repository<DeleteUserLog>,
    private readonly sessionService: SessionService
  ) {}

  async getUser(user_id: string, seatchText: string) {
    try {
      // Find user by text and return emails only
      if (seatchText) {
        console.log("seatchText: ", seatchText);
        let userArr: {
          user_id: string;
          email: string;
          mobile: string | null;
        }[] = [];

        const findUsers = await this.usersRepo.find({
          where: [
            { display_name: Like(`%${seatchText}%`) },
            { email: Like(`%${seatchText}%`) },
            { mobile_no: Like(`%${seatchText}%`) },
          ],
        });

        console.log("findUsers: ", findUsers);

        findUsers.forEach((usr) => {
          userArr.push({
            user_id: usr.id,
            email: usr.email,
            mobile: usr.mobile_no,
          });
        });

        return {
          status: 200,
          message: "Fetched User successfully",
          users: userArr,
        };
      }

      // Find user by id
      const findUser = await this.usersRepo.findOne({
        where: { id: user_id },
      });

      if (!findUser) {
        return {
          status: 400,
          message: "User do not found.",
        };
      }

      // console.log("findUser: ", findUser);

      return {
        status: 200,
        message: "Fetched User successfully",
        user: {
          user_id: findUser.id,
          display_name: findUser.display_name,
          email: findUser.email,
          dob: findUser.dob,
          gender: findUser.gender,
          mobile_no: findUser.mobile_no,
          profile_photo: findUser.profile_photo,
          username: findUser.username,
          password: findUser.password ? "********" : undefined,
        },
      };
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during fetching the user.",
        error_message: error.message,
      };
    }
  }

  async getUserEmails(seatchText: string) {
    try {
      // Find user by text and return emails only
      if (seatchText) {
        console.log("seatchText: ", seatchText);
        let userArr: {
          user_id: string;
          email: string;
          mobile: string | null;
        }[] = [];

        // Simple find query
        const findUsers = await this.usersRepo.find({
          where: [
            { email: ILike(`%${seatchText}%`) },
            { display_name: ILike(`%${seatchText}%`) },
            { mobile_no: ILike(`%${seatchText}%`) },
          ],
        });

        // console.log("findUsers: ", findUsers);

        findUsers.forEach((usr) => {
          userArr.push({
            user_id: usr.id,
            email: usr.email,
            mobile: usr.mobile_no,
          });
        });

        return {
          status: 200,
          message: "Fetched User successfully",
          users: userArr,
        };
      } else {
        return {
          status: 200,
          message: "Fetched User successfully",
          users: [],
        };
      }
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during fetching the user.",
        error_message: error.message,
      };
    }
  }

  async getUserById(user_id: string) {
    try {
      // Check if user already registered?
      const findUser = await this.usersRepo.findOne({
        where: { id: user_id },
      });

      if (!findUser) {
        return {
          status: 400,
          message: "User do not found.",
        };
      }

      return {
        status: 200,
        message: "Fetched User successfully",
        user: {
          user_id: findUser.id,
          display_name: findUser.display_name,
          email: findUser.email,
          dob: findUser.dob,
          gender: findUser.gender,
          mobile_no: findUser.mobile_no,
          profile_photo: findUser.profile_photo,
          username: findUser.username,
          password: findUser.password ? "********" : undefined,
        },
      };
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during fetching the user.",
        error_message: error.message,
      };
    }
  }

  async createUser(
    createUserDto: Partial<CreateUserDto>,
    provider_token?: string
  ) {
    try {
      // Check if user already registered?
      const findUser = await this.usersRepo.findOne({
        where: { email: createUserDto.email },
      });

      console.log("findUser: ", findUser);

      if (findUser) {
        return {
          status: 400,
          message: "User already register with us.",
          userData: {
            user_email: findUser.email,
            user_photo: findUser.profile_photo,
            userName: findUser.display_name,
            provider_token,
          },
        };
      }

      let tempSignupData = this.usersRepo.create();

      if (createUserDto.password) {
        // Hashing password before storing in DB
        const saltRound = 10;
        const hash = await bcrypt.hash(createUserDto.password, saltRound);

        createUserDto.password = hash;

        tempSignupData.password = createUserDto.password;
      }

      // Creating new user
      tempSignupData.display_name = createUserDto.display_name as string;
      tempSignupData.username =
        tempSignupData.display_name.replace(" ", "").toLowerCase() + Date.now();
      tempSignupData.dob = createUserDto.dob ? createUserDto.dob : null;
      tempSignupData.email = createUserDto.email as string;
      tempSignupData.gender = createUserDto.gender ?? null;
      tempSignupData.mobile_no = createUserDto.mobile_no ?? null;
      tempSignupData.primary_account = null;
      tempSignupData.profile_photo = createUserDto.profile_photo ?? null;

      console.log("tempSignupData: ", tempSignupData);

      let createUserRes = await this.usersRepo.save(tempSignupData);

      if (!createUserRes) {
        return {
          status: 500,
          message: "Error occured during creating the user.",
        };
      }

      return {
        status: 201,
        message: "User created successfully",
        user: createUserRes,
      };

      // console.log("createUserRes: ", createUserRes);
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during creating the user.",
        error_message: error.message,
      };
    }
  }

  async updateUser(
    user_id: string,
    updateUserDto: UpdateUserDto,
    session_id?: string,
    user_photo?: Express.Multer.File
  ) {
    let isPasswordChanged: boolean = false;

    try {
      // Check if user already registered?
      const findUser = await this.usersRepo.findOne({
        where: { id: user_id },
      });

      if (!findUser) {
        return {
          status: 400,
          message: "User is not registered.",
        };
      }

      // upload image if post_photo exist
      if (user_photo) {
        const imageBuffer = user_photo.buffer.toString("base64");

        const postImageUri = `data:${user_photo.mimetype};base64,${imageBuffer}`;

        const uploadPostImage = await cloudinary.uploader.upload(postImageUri, {
          unique_filename: true,
          overwrite: true,
          folder: `MergerApp/users/${user_id}`,
        });

        console.log("uploadPostImage: ", uploadPostImage);

        if (!uploadPostImage || !uploadPostImage.asset_id) {
          return {
            status: 500,
            message: "Error occured during uploading the user image.",
          };
        }

        //create upload log
        const tempUploadLogData = this.uploadLogRepo.create();

        tempUploadLogData.status = UploadStatus.UPLOADED;
        tempUploadLogData.post_id = findUser.id;
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

        findUser.profile_photo = uploadPostImage?.secure_url;
      }

      // Hashing password before storing in DB
      if (
        updateUserDto.currrent_password &&
        updateUserDto.currrent_password !== findUser.id
      ) {
        //Check credentials
        const isMatching = await bcrypt.compare(
          updateUserDto.currrent_password,
          findUser.password as string
        );

        if (!isMatching) {
          return {
            status: 401,
            message: "Incorrect current password.",
          };
        }

        delete updateUserDto.currrent_password;
      }

      if (updateUserDto.password) {
        const saltRound = 10;
        const hash = await bcrypt.hash(updateUserDto.password, saltRound);

        updateUserDto.password = hash;
        isPasswordChanged = true;
      }

      // Clearing the updateUserDto from null | undefined values
      for (let key of Object.keys(updateUserDto)) {
        if (!updateUserDto[key]) {
          delete updateUserDto[key];
        }
      }

      console.log("updateUserDto: ", updateUserDto);

      const updatedUserData = { ...findUser, ...updateUserDto };

      console.log("updatedUserData: ", updatedUserData);

      // Updating new user
      let updateUserRes = await this.usersRepo.save(updatedUserData);

      if (!updateUserRes) {
        return {
          status: 500,
          message: "Error occured during updating the user.",
        };
      }

      if (isPasswordChanged) {
        //End all session except this one
        const allActiveSessions = await this.sessionRepo.find({
          where: {
            user_id,
            status: SessionStatus.ACTIVE,
          },
        });

        allActiveSessions.forEach(async (ss) => {
          if (ss.id !== session_id) {
            const endSessionRes = await this.sessionService.endSession(ss.id);

            if (endSessionRes.status !== 200) {
              throw new InternalServerErrorException(endSessionRes.message);
            }
          }
        });
      }

      return {
        status: 200,
        message: "User updated successfully",
      };
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during updating the user.",
        error_message: error.message,
      };
    }
  }

  async deleteUser(
    deleteAccDto: DeleteUserDto,
    user_id: string,
    session_id: string
  ) {
    try {
      // Check if user already registered?
      const findUser = await this.usersRepo.findOne({
        where: { id: user_id },
      });

      if (!findUser) {
        return {
          status: 400,
          message: "User is not registered.",
        };
      }

      // Check credentials
      if (findUser.email !== deleteAccDto.email) {
        return {
          status: 401,
          message: "Invalid credentials!",
        };
      }

      //Check credentials
      const isMatching = await bcrypt.compare(
        deleteAccDto.password,
        findUser.password as string
      );

      if (!isMatching) {
        return {
          status: 401,
          message: "Invalid credentials!",
        };
      }

      if (!deleteAccDto.user_consent) {
        return {
          status: 401,
          message: "User consent is required!",
        };
      }

      // End all users session
      const allActiveSessions = await this.sessionRepo.find({
        where: {
          user_id,
          status: SessionStatus.ACTIVE,
        },
      });

      allActiveSessions.forEach(async (ss) => {
        const endSessionRes = await this.sessionService.endSession(ss.id);

        if (endSessionRes.status !== 200) {
          throw new InternalServerErrorException(endSessionRes.message);
        }
      });

      // deleting user
      let deleteUserRes = await this.usersRepo.delete({ id: user_id });

      if (!deleteUserRes) {
        return {
          status: 500,
          message: "Error occured during deleting the user.",
        };
      }

      // Update delete account log
      const deleteAccLog = this.delteAccLogRepo.create();

      deleteAccLog.session_id = session_id;
      deleteAccLog.user_id = user_id;
      deleteAccLog.user_consent = deleteAccDto.user_consent;
      deleteAccLog.reason_for_delete = deleteAccDto.reason_for_delete;

      await this.delteAccLogRepo.save(deleteAccLog);

      return {
        status: 200,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during deleting the user.",
        error_message: error.message,
      };
    }
  }
}
