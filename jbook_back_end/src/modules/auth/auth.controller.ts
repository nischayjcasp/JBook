import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginWithEmailDto } from "./dto/loginWithEmail.dto";
import { SignUpWithEmailDto } from "./dto/signUpWithEmail.dto";
import type { Request, Response } from "express";
import { SignUpWithGoogleDto } from "./dto/signUpWithGoogle.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //<============== Login ==============>

  @Post("/login/email")
  async loginWithEmailCntr(
    @Body() loginWithEmailDto: LoginWithEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    const loginResp = await this.authService.loginWithEmail(
      loginWithEmailDto,
      device_id
    );

    if (loginResp.status === 200) {
      res.cookie("MERGER_SESSION", loginResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: loginResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", loginResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: loginResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 200,
        message: "you have logged in successfully.",
      });
    } else {
      return loginResp;
    }
  }

  @Post("/login/google")
  async loginWithGoogleCntr(
    @Body() loginWithGoogleDto: SignUpWithGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const authCode = req.headers.authorization as string;
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    if (!authCode) {
      return {
        status: 401,
        message: "Unauthorised request, failed to sign up with google",
      };
    }

    const googleLoginResp = await this.authService.loginWithGoogle(
      loginWithGoogleDto,
      authCode,
      device_id
    );

    if (googleLoginResp.status === 200) {
      res.cookie("MERGER_SESSION", googleLoginResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: googleLoginResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", googleLoginResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: googleLoginResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 200,
        message: "you have logged in successfully.",
      });
    } else {
      return googleLoginResp;
    }
  }

  @Post("/login/facebook")
  async loginWithFacebookCntr(
    @Body() loginWithFacebookDto: SignUpWithGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const access_token = req.headers.authorization?.split(" ")[1] as string;
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    if (!access_token) {
      return {
        status: 401,
        message: "Unauthorised request, failed to sign up with facebook",
      };
    }

    const facebookLoginResp = await this.authService.loginWithFacebook(
      loginWithFacebookDto,
      access_token,
      device_id
    );

    if (facebookLoginResp.status === 200) {
      res.cookie("MERGER_SESSION", facebookLoginResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: facebookLoginResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", facebookLoginResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: facebookLoginResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 200,
        message: "you have logged in successfully.",
      });
    } else {
      return facebookLoginResp;
    }
  }

  @Post("/login/linkedin")
  async loginWithLinkedInCntr(
    @Body() loginWithLinkedInDto: SignUpWithGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const authCode = req.headers.authorization as string;
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    if (!authCode) {
      return {
        status: 401,
        message: "Unauthorised request, failed to sign up with google",
      };
    }

    const linkedInLoginResp = await this.authService.loginWithLinkedIn(
      loginWithLinkedInDto,
      authCode,
      device_id
    );

    if (linkedInLoginResp.status === 200) {
      res.cookie("MERGER_SESSION", linkedInLoginResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: linkedInLoginResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", linkedInLoginResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: linkedInLoginResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 200,
        message: "You have logged in successfully.",
      });
    } else {
      return linkedInLoginResp;
    }
  }

  //<============== Logout ==============>
  @Get("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId: string = req.cookies["MERGER_SESSION"];

    console.log("sessionId: ", sessionId);

    if (!sessionId) {
      return {
        status: 401,
        message: "Unauthorised request!",
      };
    }

    const logoutRes = await this.authService.logoutSession(sessionId);

    // Clearing the coooking
    if (logoutRes.status === 200) {
      res.cookie("MERGER_SESSION", "", {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });

      res.cookie("MERGER_ACCESS_TOKEN", "", {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
    }

    res.json(logoutRes);
  }

  //<============== Sign Up ==============>

  @Post("/signup/email")
  async signupWithEmailCntr(
    @Body() signUpWithEmailDto: SignUpWithEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log("signUpWithEmailDto: ", signUpWithEmailDto);

    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    const signupResp = await this.authService.signupWithEmail(
      signUpWithEmailDto,
      device_id
    );

    if (signupResp.status === 200) {
      res.cookie("MERGER_SESSION", signupResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: signupResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", signupResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: signupResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 201,
        message: "You have signed up successfully.",
      });
    } else {
      return signupResp;
    }
  }

  @Post("/signup/google")
  async signupWithGoogleCntr(
    @Body() signUpWithGoogleDto: SignUpWithGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const authCode = req.headers.authorization as string;
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    if (!authCode) {
      return {
        status: 401,
        message: "Unauthorised request, failed to sign up with google",
      };
    }

    const googleSignupResp = await this.authService.signupWithGoogle(
      signUpWithGoogleDto,
      authCode,
      device_id
    );

    if (googleSignupResp.status === 200) {
      res.cookie("MERGER_SESSION", googleSignupResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: googleSignupResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", googleSignupResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: googleSignupResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 201,
        message: "You have signed up successfully.",
      });
    } else {
      return googleSignupResp;
    }
  }

  @Post("/signup/facebook")
  async signupWithFacebookCntr(
    @Body() signUpWithFacebookDto: SignUpWithGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const access_token = req.headers.authorization?.split(" ")[1] as string;
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    if (!access_token) {
      return {
        status: 401,
        message: "Unauthorised request, failed to sign up with google",
      };
    }

    const facebookSignupResp = await this.authService.signupWithFacebook(
      signUpWithFacebookDto,
      access_token,
      device_id
    );

    if (facebookSignupResp.status === 200) {
      res.cookie("MERGER_SESSION", facebookSignupResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: facebookSignupResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", facebookSignupResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: facebookSignupResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 201,
        message: "You have signed up successfully.",
      });
    } else {
      return facebookSignupResp;
    }
  }

  @Post("/signup/linkedin")
  async signupWithLinkedInCntr(
    @Body() signUpWithLinkedInDto: SignUpWithGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const authCode = req.headers.authorization as string;
    const device_id: string = req.cookies["MERGER_DEVICE_ID"];

    if (!authCode) {
      return {
        status: 401,
        message: "Unauthorised request, failed to sign up with google",
      };
    }

    const linkedInSignupResp = await this.authService.signupWithLinkedIn(
      signUpWithLinkedInDto,
      authCode,
      device_id
    );

    if (linkedInSignupResp.status === 200) {
      res.cookie("MERGER_SESSION", linkedInSignupResp.session_id, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: linkedInSignupResp.session_exp,
      });

      res.cookie("MERGER_ACCESS_TOKEN", linkedInSignupResp.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: linkedInSignupResp.access_token_exp,
      });

      res.cookie("MERGER_DEVICE_ID", device_id ?? crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 400 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 201,
        message: "You have signed up successfully.",
      });
    } else {
      return linkedInSignupResp;
    }
  }

  //<============== Other ==============>

  @Get("/refresh/token")
  async refreshTokenCntr(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const session_id: string = req.cookies["MERGER_SESSION"];

    console.log("session_id: ", session_id);

    const refreshTokenRes = await this.authService.refreshToken(session_id);

    console.log("refreshTokenRes: ", refreshTokenRes);

    if (refreshTokenRes.status === 200) {
      res.cookie("MERGER_ACCESS_TOKEN", refreshTokenRes.access_token, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: refreshTokenRes.access_token_exp,
      });

      res.json({
        status: 200,
        message: "Session renewed successfully.",
      });
    } else {
      // res.cookie("MERGER_ACCESS_TOKEN", "", {
      //   httpOnly: true,
      //   secure: process.env.APP_ENV === "production",
      //   sameSite: "strict",
      //   path: "/",
      //   maxAge: 0,
      // });

      // res.cookie("MERGER_SESSION", "", {
      //   httpOnly: true,
      //   secure: process.env.APP_ENV === "production",
      //   sameSite: "strict",
      //   path: "/",
      //   maxAge: 0,
      // });

      res.json(refreshTokenRes);
    }
  }
}
