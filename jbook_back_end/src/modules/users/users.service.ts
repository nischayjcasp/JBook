import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { DeviceInfo } from "src/common/utils/deviceInfo.utils";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>
  ) {}

  async createUser(createUserDto: Partial<CreateUserDto>) {
    try {
      // Check if user already registered?
      const findUser = await this.usersRepo.findOne({
        where: { email: createUserDto.signup_email },
      });

      if (findUser) {
        return {
          status: 400,
          message: "User already register with us.",
        };
      }

      let tempSignupData = this.usersRepo.create();

      if (createUserDto.signup_password) {
        // Hashing password before storing in DB
        const saltRound = 10;
        const hash = await bcrypt.hash(
          createUserDto.signup_password,
          saltRound
        );

        createUserDto.signup_password = hash;

        tempSignupData.password = createUserDto.signup_password;
      }

      // Creating new user
      tempSignupData.display_name = createUserDto.signup_display_name as string;
      tempSignupData.username = tempSignupData.display_name + Date.now();
      tempSignupData.dob = createUserDto.signup_dob ?? null;
      tempSignupData.email = createUserDto.signup_email as string;
      tempSignupData.gender = createUserDto.signup_gender ?? null;
      tempSignupData.mobile_no = createUserDto.signup_mobile ?? null;
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

  async updateUser(user_id: string, updateUserDto: UpdateUserDto) {
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

      if (updateUserDto.signup_password) {
        // Hashing password before storing in DB
        const saltRound = 10;
        const hash = await bcrypt.hash(
          updateUserDto.signup_password,
          saltRound
        );

        updateUserDto.signup_password = hash;
      }

      // Clearing the updateUserDto from null | undefined values
      for (let key of Object.keys(updateUserDto)) {
        if (!updateUserDto[key]) {
          delete updateUserDto[key];
        }
      }

      console.log("updateUserDto: ", updateUserDto);

      const updatedUserData = Object.assign(findUser, {
        password: updateUserDto.signup_password,
      });

      console.log("updatedUserData: ", updatedUserData);

      // Updating new user
      let updateUserRes = await this.usersRepo.save(updatedUserData);

      if (!updateUserRes) {
        return {
          status: 500,
          message: "Error occured during updating the user.",
        };
      }

      return {
        status: 200,
        message: "User updated successfully",
        user: updateUserRes,
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
}
