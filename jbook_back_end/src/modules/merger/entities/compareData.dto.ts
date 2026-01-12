import { IsNotEmpty, IsString } from "class-validator";

export class CompareDataDto {
  @IsNotEmpty()
  @IsString()
  primaryAcc: string;

  @IsNotEmpty()
  @IsString()
  secondaryAcc: string;
}
