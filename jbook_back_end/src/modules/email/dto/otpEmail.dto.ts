import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class OtpEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
