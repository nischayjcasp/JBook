import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { UserSession } from "../session/entities/user_session.entity";
import { UploadLog } from "../post/entities/uploadLog.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserSession, UploadLog])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
