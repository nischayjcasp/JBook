import { Type } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
  MinDate,
  MinLength,
} from "class-validator";

let MaxDob = new Date();
MaxDob.setFullYear(MaxDob.getFullYear() - 14);

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export class SignUpWithEmailDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "Username must be 3 character long." })
  @MaxLength(20, { message: "Username can not bigger then 20 characters." })
  @Matches(/^[a-z]+$/, { message: "Username must have alphabates only." })
  signup_username: string;

  @Type(() => Date)
  @IsDate()
  @MaxDate(() => MaxDob, { message: "User must be 14 year old." })
  @MinDate(() => new Date("1900-01-01"), {
    message: "Birth date cannot be in the before 1900-01-01",
  })
  signup_dob: Date;

  @IsEnum(Gender, { message: "Gender must be either male or female" })
  @IsNotEmpty()
  signup_gender: Gender;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: "Mobile number must have digits only" })
  @Matches(/^.{10}$/, { message: "Mobile number must have 10 digits exactly." })
  signup_mobile: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  signup_email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\d/, { message: "Password must have 1 digit" })
  @Matches(/[a-z]/, { message: "Password must have 1 lowercase letter" })
  @Matches(/[A-Z]/, { message: "Password must have 1 capital letter" })
  @Matches(/[~`!@#$%\^&*\(\)_\-+=\[\]{};:'"\\|,\.<>\/?]/, {
    message: "Password must have 1 special character",
  })
  @Matches(/.{8,}/, {
    message: "Password must have at least 8 characters",
  })
  signup_password: string;

  @IsOptional()
  @IsString()
  user_agent: string | null;

  @IsOptional()
  @IsString()
  device_ip: string | null;

  @IsOptional()
  @IsNumber()
  device_lat: number | null;

  @IsOptional()
  @IsNumber()
  device_long: number | null;
}
