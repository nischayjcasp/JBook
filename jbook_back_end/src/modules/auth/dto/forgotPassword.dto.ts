import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  forgot_pass_email: string;

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
