import { IsNotEmpty, IsString } from "class-validator";

export class SentEmailDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  address_to: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
