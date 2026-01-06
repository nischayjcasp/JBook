import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionModule } from "./modules/session/session.module";
import { validate } from "./config/env.validation";
import { EmailService } from "./modules/email/email.service";
import { EmailModule } from "./modules/email/email.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { PostModule } from "./modules/post/post.module";
import { AuthMiddleware } from "./middlewares/auth.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        port: config.get("DB_PORT"),
        host: config.get("DB_HOST"),
        database: config.get("DB_NAME"),
        username: config.get("DB_USER"),
        password: config.get("DB_PASSWORD"),
        autoLoadEntities: true,
        synchronize: config.get("APP_ENV") !== "production",
        logging: config.get("APP_ENV") !== "production",
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get("GOOGLE_SMTP_SERVICE"),
          // port: config.get("GOOGLE_SMTP_PORT"),
          // secure: config.get("GOOGLE_SMTP_SECURE"),
          auth: {
            user: config.get("GOOGLE_USER"),
            pass: config.get("GOOGLE_MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: "Merger App <nischay.jcasp@protonmail.com>",
        },
      }),
    }),
    AuthModule,
    UsersModule,
    SessionModule,
    EmailModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "/auth/login/*splat", method: RequestMethod.ALL },
        { path: "/auth/signup/*splat", method: RequestMethod.ALL },
        { path: "auth/forgot/password", method: RequestMethod.ALL },
        { path: "/auth/refresh/token", method: RequestMethod.ALL }
      )
      .forRoutes("*");
  }
}
