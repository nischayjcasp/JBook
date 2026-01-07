import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response, NextFunction } from "express";
import { UserSession } from "src/modules/session/entities/user_session.entity";
import { SessionService } from "src/modules/session/session.service";
import { Users } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    private readonly sessionService: SessionService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.originalUrl;
    const access_token =
      req.cookies["MERGER_ACCESS_TOKEN"] ??
      req.headers.authorization?.split(" ")[1];

    console.log("Middleware running for path: ", path);

    try {
      // console.log("access_token: ", access_token);

      const verifyAccessToken =
        await this.sessionService.verifyAccessToken(access_token);

      console.log("verifyAccessToken: ", verifyAccessToken);

      if (verifyAccessToken && verifyAccessToken.sub) {
        // get sesion info
        const findSession = await this.sessionRepo.findOne({
          where: { id: verifyAccessToken.sub },
        });

        if (!findSession) {
          throw new InternalServerErrorException("User has no active session!");
        }

        // console.log("findSession: ", findSession);

        const findUser = await this.usersRepo.findOne({
          where: { id: findSession.user_id as string },
        });

        if (!findUser) {
          throw new InternalServerErrorException(
            "AuthMiddleware:Internal server error"
          );
        }

        // console.log("findUser: ", findUser);

        req.user = {
          user_id: findUser.id,
          session: findSession.id,
        };

        next();
      } else {
        console.log("Here...");

        throw new UnauthorizedException("Unauthorized request!");
      }
    } catch (error) {
      console.log("Error: ", error.name);

      if (error.name === "UnauthorizedException") {
        throw new UnauthorizedException("Unauthorized request!");
      }

      throw new InternalServerErrorException(
        "AuthMiddleware:Internal server error"
      );
    }
  }
}
