import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  post_title: string;

  @IsNotEmpty()
  @IsString()
  post_text: string;

  @IsNotEmpty()
  @IsString()
  post_image: string;
}
