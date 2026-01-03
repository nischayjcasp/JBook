import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailLogs } from "./entities/emailLog.entity";
import { SessionModule } from "../session/session.module";
import { ResetPasswordLog } from "../auth/entities/resetPassword.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogs, ResetPasswordLog]),
    SessionModule,
  ],
  providers: [EmailService],
  exports: [EmailService, TypeOrmModule],
})
export class EmailModule {}
