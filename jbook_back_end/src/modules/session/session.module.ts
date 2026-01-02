import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSession } from "./entities/user_session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [TypeOrmModule, SessionService],
})
export class SessionModule {}
