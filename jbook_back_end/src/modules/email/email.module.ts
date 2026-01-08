import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailLogs } from "./entities/emailLog.entity";
import { SessionModule } from "../session/session.module";
import { ResetPasswordLog } from "../auth/entities/resetPassword.entity";
import { OTP } from "../auth/entities/otp.entity";
import { Users } from "../users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogs, ResetPasswordLog, OTP, Users]),
    SessionModule,
  ],
  providers: [EmailService],
  exports: [EmailService, TypeOrmModule],
})
export class EmailModule {}
