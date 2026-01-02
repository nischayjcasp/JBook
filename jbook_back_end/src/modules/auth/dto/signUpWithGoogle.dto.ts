import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SignUpWithGoogleDto {
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
