import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  new_pass: string;

  @IsString()
  @IsNotEmpty()
  resetCode: string;

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
