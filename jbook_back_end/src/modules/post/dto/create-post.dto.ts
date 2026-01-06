import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  post_title: string;

  @IsNotEmpty()
  @IsString()
  post_text: string;
}
