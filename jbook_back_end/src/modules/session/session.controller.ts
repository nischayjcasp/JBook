import { Controller, Get, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { SessionService } from "./session.service";

@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get("verify")
  async verifySessionCntr(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const access_token = req.headers.authorization?.split(" ")[1];

    console.log("access_token: ", access_token);

    if (!access_token) {
      return {
        status: 401,
        message: "Unauthorised request!!",
      };
    }

    return this.sessionService.verifySession(access_token);
  }
}
