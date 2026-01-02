import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class LoginWithEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  login_email: string;

  @IsString()
  @IsNotEmpty()
  login_password: string;

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
