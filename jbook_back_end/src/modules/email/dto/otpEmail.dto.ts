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

  @IsOptional()
  @IsString()
  device_id: string | null;

  @IsOptional()
  @IsString()
  device_type: string | null;

  @IsOptional()
  @IsString()
  device_os: string | null;

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
