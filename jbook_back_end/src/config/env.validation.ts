import { plainToInstance } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from "class-validator";

enum App_Env {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

// ENV Schema

class EnvVariables {
  @IsEnum(App_Env)
  APP_ENV: App_Env;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRY: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRY: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  LINKED_IN_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  LINKED_IN_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  LINKEDIN_LOGIN_REDIRECT_URI: string;

  @IsString()
  @IsNotEmpty()
  LINKEDIN_SINGUP_REDIRECT_URI: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_SMTP_SERVICE: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  GOOGLE_SMTP_PORT: number;

  @IsBoolean()
  GOOGLE_SMTP_SECURE: boolean;

  @IsString()
  @IsNotEmpty()
  GOOGLE_USER: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_MAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_FROM_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  RESET_PASSSWORD_SECRET: string;

  @IsString()
  @IsNotEmpty()
  RESET_PASSSWORD_EXPIRY: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string;
}

// Validation function
export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
