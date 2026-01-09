import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { SessionStatus, UserSession } from "./entities/user_session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import {
  CreatedSessionData,
  DecodedToken,
  EndSessionResp,
  SessionData,
} from "./session.type";
import { DeviceInfo } from "src/common/utils/deviceInfo.utils";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    private readonly jwt: JwtService
  ) {}

  // <==================  Token Service ==================>
  async genearateAccessToken(sessionId: string) {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

    const access_token_payload = {
      sub: sessionId,
    };

    const access_token = await this.jwt.signAsync(access_token_payload, {
      secret: ACCESS_TOKEN_SECRET as string,
      expiresIn: ACCESS_TOKEN_EXPIRY as number | any,
    });

    if (!access_token) {
      throw new InternalServerErrorException(
        "Error occured while generating access token"
      );
    }

    return access_token;
  }

  async verifyAccessToken(token: string) {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    try {
      const access_token_decoded = await this.jwt.verifyAsync(token, {
        secret: ACCESS_TOKEN_SECRET as string,
      });

      return access_token_decoded ?? null;
    } catch (error) {
      console.log("verifyAccessToken-Error: ", error.name);
      return null;
    }
  }

  async genearateRefreshToken(sessionId: string) {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

    const refresh_token_payload = {
      sub: sessionId,
    };

    const refresh_token = await this.jwt.signAsync(refresh_token_payload, {
      secret: REFRESH_TOKEN_SECRET as string,
      expiresIn: REFRESH_TOKEN_EXPIRY as number | any,
    });

    if (!refresh_token) {
      throw new InternalServerErrorException(
        "Error occured while generating refresh token"
      );
    }

    return refresh_token;
  }

  async verifyRefreshToken(token: string): Promise<DecodedToken | null> {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    try {
      const refresh_token_decoded: DecodedToken = await this.jwt.verifyAsync(
        token,
        {
          secret: REFRESH_TOKEN_SECRET as string,
        }
      );

      return refresh_token_decoded;
    } catch (error) {
      console.log("verifyRefreshToken-Error: ", error);
      return null;
    }
  }

  async genearateResetPasswordToken(userId: string) {
    const RESET_PASSSWORD_SECRET = process.env.RESET_PASSSWORD_SECRET;
    const RESET_PASSSWORD_EXPIRY = process.env.RESET_PASSSWORD_EXPIRY;

    const reset_pass_token_payload = {
      sub: userId,
    };

    const reset_pass_token = await this.jwt.signAsync(
      reset_pass_token_payload,
      {
        secret: RESET_PASSSWORD_SECRET as string,
        expiresIn: RESET_PASSSWORD_EXPIRY as number | any,
      }
    );

    if (!reset_pass_token) {
      throw new InternalServerErrorException(
        "Error occured while generating reset password token"
      );
    }

    return reset_pass_token;
  }

  async verifyResetPasswordToken(token: string) {
    const RESET_PASSSWORD_SECRET = process.env.RESET_PASSSWORD_SECRET;

    try {
      const reset_pass_token_decoded = await this.jwt.verifyAsync(token, {
        secret: RESET_PASSSWORD_SECRET as string,
      });

      return reset_pass_token_decoded ?? null;
    } catch (error) {
      console.log("verifyResetPasswordToken-Error: ", error);
      return null;
    }
  }

  // <==================  Session Service ==================>

  async createSession(sessionData: SessionData): Promise<CreatedSessionData> {
    let deviceInfo: any = null;

    //Get device information
    if (sessionData.user_agent) {
      deviceInfo = await DeviceInfo(sessionData.user_agent);
    }

    console.log("deviceInfo: ", deviceInfo);

    // Creating new session
    const newSession = this.sessionRepo.create();

    newSession.user_id = sessionData.userId;
    newSession.status = SessionStatus.BLOCKED;
    newSession.device_id = sessionData.device_id;
    newSession.device_type = deviceInfo.device.type ?? null;
    newSession.device_os = deviceInfo.os.name ?? null;
    newSession.device_ip = sessionData.device_ip;
    newSession.device_lat = sessionData.device_lat;
    newSession.device_long = sessionData.device_long;

    const createdSession = await this.sessionRepo.save(newSession);

    if (!createdSession) {
      throw new InternalServerErrorException(
        "Error occurred while creating session"
      );
    }

    // Generating the new refresh token
    const refresh_token = await this.genearateRefreshToken(newSession.id);

    console.log("refresh_token: ", refresh_token);

    const refresh_token_decoded = await this.verifyRefreshToken(refresh_token);

    console.log("refresh_token_decoded: ", refresh_token_decoded);

    if (!refresh_token_decoded) {
      throw new InternalServerErrorException("refresh token expired already!!");
    }

    // Updating created session
    const findSession = await this.sessionRepo.findOne({
      where: {
        id: createdSession.id,
      },
    });

    if (!findSession) {
      throw new InternalServerErrorException("New session do not found");
    }

    findSession.refresh_token = refresh_token;
    findSession.expires_at = new Date(refresh_token_decoded.exp * 1000);
    findSession.status = sessionData.sessionStatus ?? SessionStatus.ACTIVE;

    const updatedSession = await this.sessionRepo.save(findSession);

    if (!updatedSession) {
      throw new InternalServerErrorException(
        "Error occurred while updating session"
      );
    }

    // Generating access token
    const access_token = await this.genearateAccessToken(updatedSession.id);

    console.log("access_token: ", access_token);

    const access_token_decoded = await this.verifyAccessToken(access_token);

    console.log("access_token_decoded: ", access_token_decoded);

    if (!access_token_decoded) {
      throw new InternalServerErrorException("access token expired already!!");
    }

    return {
      session_id: updatedSession.id,
      session_exp: updatedSession.expires_at as Date,
      access_token,
      access_token_exp: new Date(access_token_decoded.exp * 1000),
    };
  }

  async endSession(sessionId: string): Promise<EndSessionResp> {
    // find the session
    const findSession = await this.sessionRepo.findOne({
      where: {
        id: sessionId,
      },
    });

    if (!findSession) {
      return {
        status: 400,
        message: "There is no active session.",
      };
    }

    findSession.status = SessionStatus.EXPIRED;

    const updatedSession = await this.sessionRepo.save(findSession);

    if (!updatedSession) {
      return {
        status: 500,
        message: "Error occurred while updating session!",
      };
    }

    return {
      status: 200,
      message: "You have logged out successfully.",
    };
  }

  async verifySession(access_token: string) {
    try {
      // const isVerified = await this.verifyAccessToken(access_token);

      // console.log("isVerified: ", isVerified);

      // if (isVerified) {
      //   return {
      //     status: 200,
      //     message: "Session verified successfully.",
      //   };
      // } else {
      //   return {
      //     status: 401,
      //     message: "Unauthorised request!!",
      //   };
      // }

      return {
        status: 200,
        message: "Session verified successfully.",
      };
    } catch (error) {
      console.log("verifySession - error: ", error.message);
      return {
        status: 500,
        message: "verifySession - error:Internal server error",
        error_message: error.message,
      };
    }
  }
}
