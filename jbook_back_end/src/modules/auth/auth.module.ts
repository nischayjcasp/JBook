import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../users/entities/user.entity";
import { SessionModule } from "../session/session.module";
import { UserSession } from "../session/entities/user_session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserSession]), SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
