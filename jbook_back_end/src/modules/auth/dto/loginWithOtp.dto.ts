import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LoginWithOtpDto {
  @IsNotEmpty()
  @IsString()
  otp_id: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

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
