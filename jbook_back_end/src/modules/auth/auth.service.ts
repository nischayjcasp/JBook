import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { LoginWithEmailDto } from "./dto/loginWithEmail.dto";
import { SignUpWithEmailDto } from "./dto/signUpWithEmail.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Users } from "../users/entities/user.entity";
import { SessionService } from "../session/session.service";
import { SessionData } from "../session/session.type";
import axios from "axios";
import { DeviceInfo } from "src/common/utils/deviceInfo.utils";
import { GoogleTokenResType, GoogleUserInfoType } from "./auth.type";
import { SignUpWithGoogleDto } from "./dto/signUpWithGoogle.dto";
import { UserSession } from "../session/entities/user_session.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    private readonly sessionService: SessionService
  ) {}

  //<============== Login ==============>

  async loginWithEmail(
    loginWithEmailDto: LoginWithEmailDto,
    device_id: string
  ) {
    try {
      // finduser in DB
      const finduser = await this.usersRepo.findOne({
        where: {
          email: loginWithEmailDto.login_email,
        },
      });

      if (!finduser) {
        return {
          status: 401,
          message: "Incorrect credentials!",
        };
      }

      if (!finduser.password) {
        return {
          status: 400,
          message: "User have not set any password",
        };
      }

      //Check credentials
      const isMatching = await bcrypt.compare(
        loginWithEmailDto.login_password,
        finduser.password
      );

      if (!isMatching) {
        return {
          status: 401,
          message: "Incorrect credentials!",
        };
      }

      const deviceInfo = await DeviceInfo(
        loginWithEmailDto.user_agent as string
      );

      console.log("deviceInfo: ", deviceInfo);

      const sessionPayload: SessionData = {
        userId: finduser.id,
        device_id: device_id,
        device_type: deviceInfo.device.type ?? null,
        device_os: deviceInfo.os.name ?? null,
        device_ip: loginWithEmailDto.device_ip as string,
        device_lat: loginWithEmailDto.device_lat,
        device_long: loginWithEmailDto.device_long,
      };
      const createdSession =
        await this.sessionService.createSession(sessionPayload);

      console.log("createdSession: ", createdSession);

      return {
        status: 200,
        session_id: createdSession.session_id,
        session_exp: createdSession.session_exp,
        access_token: createdSession.access_token,
        access_token_exp: createdSession.access_token_exp,
      };
    } catch (error) {
      console.log("Error: ", error);

      return {
        status: 500,
        messsage: "Internal server error: loginWithEmail",
      };
    }
  }

  async loginWithGoogle(
    loginWithGoogleDto: SignUpWithGoogleDto,
    authCode: string,
    device_id: string
  ) {
    // Get Api to verify google access_token
    // https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=

    console.log("authCode: ", authCode);

    try {
      // Get google access token
      const googleTokenRes = await axios.post<Partial<GoogleTokenResType>>(
        "https://oauth2.googleapis.com/token",
        {
          code: authCode,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "postmessage",
          grant_type: "authorization_code",
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("googleTokenRes: ", googleTokenRes.data);

      // Get google user data from access_token
      if (googleTokenRes.data && googleTokenRes.data.access_token) {
        const googleUserInfo = await axios.get<Partial<GoogleUserInfoType>>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${googleTokenRes.data.access_token}`,
            },
          }
        );

        console.log("googleUserInfo: ", googleUserInfo.data);

        // Check if user already registered?
        const findUser = await this.usersRepo.findOne({
          where: { email: googleUserInfo.data.email },
        });

        if (!findUser) {
          return {
            status: 400,
            message: "User is not registered.",
          };
        }

        // Create new session for user

        const deviceInfo = await DeviceInfo(
          loginWithGoogleDto.user_agent as string
        );

        console.log("deviceInfo: ", deviceInfo);

        const sessionPayload: SessionData = {
          userId: findUser.id,
          device_id,
          device_type: deviceInfo.device.type ?? null,
          device_os: deviceInfo.os.name ?? null,
          device_ip: loginWithGoogleDto.device_ip as string,
          device_lat: loginWithGoogleDto.device_lat,
          device_long: loginWithGoogleDto.device_long,
        };

        const createdSession =
          await this.sessionService.createSession(sessionPayload);

        console.log("createdSession: ", createdSession);

        return {
          status: 200,
          session_id: createdSession.session_id,
          session_exp: createdSession.session_exp,
          access_token: createdSession.access_token,
          access_token_exp: createdSession.access_token_exp,
        };
      }

      return { status: 201, message: "You have signed up successfully." };
    } catch (error) {
      console.log("Error: ", error);
      return { status: 500, message: error.message };
    }
  }

  async loginWithFacebook(
    loginWithFacebookDto: SignUpWithGoogleDto,
    access_token: string,
    device_id: string
  ) {
    console.log("access_token: ", access_token);

    try {
      // Get facebook user data
      const faceebookUserInfo = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
      );

      console.log("faceebookUserInfo: ", faceebookUserInfo.data);

      // let faceebookUserInfo.data = {
      //   id: "122093783361160363",
      //   name: "Nischay Jcasp",
      //   email: "nischay.jcasp@gmail.com",
      //   picture: {
      //     data: {
      //       height: 50,
      //       is_silhouette: true,
      //       url: "https://scontent.famd4-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=2sMfw6QbhjAQ7kNvwEueL0x&_nc_oc=AdnD4W32DYAZPvGXp6GWGb2Yx9iHkU3-zU2jA0kZg1dZSi93exMqAqmTMvMd78XIKkWDbBaco5x0CCJgodCrKw-f&_nc_zt=24&_nc_ht=scontent.famd4-1.fna&edm=AP4hL3IEAAAA&oh=00_AfqKb45xrH91SZ53wupnPIkWgZa5vDyu1HT3BNSRqNODWQ&oe=697EE1D9",
      //       width: 50,
      //     },
      //   },
      // };

      if (faceebookUserInfo.data) {
        // Check if user already registered?
        const findUser = await this.usersRepo.findOne({
          where: { email: faceebookUserInfo.data.email },
        });

        if (!findUser) {
          return {
            status: 400,
            message: "User is not registered.",
          };
        }

        // Create new session for user
        const deviceInfo = await DeviceInfo(
          loginWithFacebookDto.user_agent as string
        );

        console.log("deviceInfo: ", deviceInfo);

        const sessionPayload: SessionData = {
          userId: findUser.id,
          device_id,
          device_type: deviceInfo.device.type ?? null,
          device_os: deviceInfo.os.name ?? null,
          device_ip: loginWithFacebookDto.device_ip as string,
          device_lat: loginWithFacebookDto.device_lat,
          device_long: loginWithFacebookDto.device_long,
        };

        const createdSession =
          await this.sessionService.createSession(sessionPayload);

        console.log("createdSession: ", createdSession);

        return {
          status: 200,
          session_id: createdSession.session_id,
          session_exp: createdSession.session_exp,
          access_token: createdSession.access_token,
          access_token_exp: createdSession.access_token_exp,
        };
      } else {
        return { status: 500, message: "Failed to sign up with facebook!" };
      }
    } catch (error) {
      console.log("Error: ", error);
      return { status: 500, message: error.message };
    }
  }

  async loginWithLinkedIn(
    loginWithLinkedInDto: SignUpWithGoogleDto,
    authCode: string,
    device_id: string
  ) {
    try {
      console.log("authCode: ", authCode);

      // Get Linked In access token
      const linkedInAccessTokenRes = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: process.env.LINKEDIN_LOGIN_REDIRECT_URI!,
          client_id: process.env.LINKED_IN_CLIENT_ID!,
          client_secret: process.env.LINKED_IN_CLIENT_SECRET!,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("linkedInAccessTokenRes: ", linkedInAccessTokenRes.data);

      if (
        linkedInAccessTokenRes.data &&
        linkedInAccessTokenRes.data.access_token
      ) {
        // Get Linked In User info
        const linkedInProfileRes = await axios.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${linkedInAccessTokenRes.data.access_token}`,
            },
          }
        );

        console.log("linkedInProfileRes: ", linkedInProfileRes.data);

        // Check if user already registered?
        const findUser = await this.usersRepo.findOne({
          where: { email: linkedInProfileRes.data.email },
        });

        if (!findUser) {
          return {
            status: 400,
            message: "User is not registedred.",
          };
        }

        // Create new session for user
        const deviceInfo = await DeviceInfo(
          loginWithLinkedInDto.user_agent as string
        );

        console.log("deviceInfo: ", deviceInfo);

        const sessionPayload: SessionData = {
          userId: findUser.id,
          device_id,
          device_type: deviceInfo.device.type ?? null,
          device_os: deviceInfo.os.name ?? null,
          device_ip: loginWithLinkedInDto.device_ip as string,
          device_lat: loginWithLinkedInDto.device_lat,
          device_long: loginWithLinkedInDto.device_long,
        };

        const createdSession =
          await this.sessionService.createSession(sessionPayload);

        console.log("createdSession: ", createdSession);

        return {
          status: 200,
          session_id: createdSession.session_id,
          session_exp: createdSession.session_exp,
          access_token: createdSession.access_token,
          access_token_exp: createdSession.access_token_exp,
        };
      } else {
        return {
          status: 500,
          message: "Failed to login with linked in",
        };
      }
    } catch (error) {
      console.log("Error: ", error);
      return { status: 500, message: error.message };
    }
  }

  //<============== Logout ==============>

  async logoutSession(sessionId: string) {
    // end the session
    const endSessionRes = await this.sessionService.endSession(sessionId);

    return endSessionRes;
  }

  //<============== Sign Up ==============>

  async signupWithEmail(
    signUpWithEmailDto: SignUpWithEmailDto,
    device_id: string
  ) {
    try {
      // Check if user already registered?
      const findUser = await this.usersRepo.findOne({
        where: { email: signUpWithEmailDto.signup_email },
      });

      if (findUser) {
        return {
          status: 400,
          message: "User already register with us.",
        };
      }

      // Hashing password before storing in DB
      const saltRound = 10;
      const hash = await bcrypt.hash(
        signUpWithEmailDto.signup_password,
        saltRound
      );

      signUpWithEmailDto.signup_password = hash;

      // console.log("signUpWithEmailDto: ", signUpWithEmailDto);

      // Creating new user

      let tempSignupData = this.usersRepo.create();

      tempSignupData.display_name = signUpWithEmailDto.signup_username;
      tempSignupData.username = tempSignupData.display_name + Date.now();
      tempSignupData.dob = signUpWithEmailDto.signup_dob;
      tempSignupData.email = signUpWithEmailDto.signup_email;
      tempSignupData.gender = signUpWithEmailDto.signup_gender;
      tempSignupData.mobile_no = signUpWithEmailDto.signup_mobile;
      tempSignupData.password = signUpWithEmailDto.signup_password;
      tempSignupData.primary_account = null;
      tempSignupData.profile_photo = null;

      // console.log("tempSignupData: ", tempSignupData);

      let createUserRes = await this.usersRepo.save(tempSignupData);

      // console.log("createUserRes: ", createUserRes);

      // Create new session for user
      if (createUserRes) {
        const deviceInfo = await DeviceInfo(
          signUpWithEmailDto.user_agent as string
        );

        // console.log("deviceInfo: ", deviceInfo);

        const sessionPayload: SessionData = {
          userId: createUserRes.id,
          device_id: device_id,
          device_type: deviceInfo.device.type ?? null,
          device_os: deviceInfo.os.name ?? null,
          device_ip: signUpWithEmailDto.device_ip as string,
          device_lat: signUpWithEmailDto.device_lat,
          device_long: signUpWithEmailDto.device_long,
        };

        const createdSession =
          await this.sessionService.createSession(sessionPayload);

        // console.log("createdSession: ", createdSession);

        return {
          status: 200,
          session_id: createdSession.session_id,
          session_exp: createdSession.session_exp,
          access_token: createdSession.access_token,
          access_token_exp: createdSession.access_token_exp,
        };
      } else {
        return {
          status: 500,
          message: "Error occured during creating the user.",
        };
      }
    } catch (error) {
      console.log("error", error);

      return {
        status: 500,
        message: "Error occured during creating the user.",
        error_message: error.message,
      };
    }
  }

  async signupWithGoogle(
    signUpWithGoogleDto: SignUpWithGoogleDto,
    authCode: string,
    device_id: string
  ) {
    console.log("authCode: ", authCode);

    try {
      // Get google access token
      const googleTokenRes = await axios.post<Partial<GoogleTokenResType>>(
        "https://oauth2.googleapis.com/token",
        {
          code: authCode,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "postmessage",
          grant_type: "authorization_code",
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("googleTokenRes: ", googleTokenRes.data);

      // Get google user data from access_token
      if (googleTokenRes.data && googleTokenRes.data.access_token) {
        const googleUserInfo = await axios.get<Partial<GoogleUserInfoType>>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${googleTokenRes.data.access_token}`,
            },
          }
        );

        console.log("googleUserInfo: ", googleUserInfo.data);

        // Check if user already registered?
        const findUser = await this.usersRepo.findOne({
          where: { email: googleUserInfo.data.email },
        });

        if (findUser) {
          return {
            status: 400,
            message: "User already register with us.",
          };
        }

        // Creating new user
        let tempSignupData = this.usersRepo.create();

        tempSignupData.display_name = googleUserInfo.data.name as string;
        tempSignupData.username =
          tempSignupData.display_name.replaceAll(" ", "") + Date.now();
        tempSignupData.email = googleUserInfo.data.email as string;
        tempSignupData.primary_account = null;
        tempSignupData.profile_photo = googleUserInfo.data.picture ?? null;

        console.log("tempSignupData: ", tempSignupData);

        let createUserRes = await this.usersRepo.save(tempSignupData);

        console.log("createUserRes: ", createUserRes);

        // Create new session for user
        if (createUserRes) {
          const deviceInfo = await DeviceInfo(
            signUpWithGoogleDto.user_agent as string
          );

          console.log("deviceInfo: ", deviceInfo);

          const sessionPayload: SessionData = {
            userId: createUserRes.id,
            device_id,
            device_type: deviceInfo.device.type ?? null,
            device_os: deviceInfo.os.name ?? null,
            device_ip: signUpWithGoogleDto.device_ip as string,
            device_lat: signUpWithGoogleDto.device_lat,
            device_long: signUpWithGoogleDto.device_long,
          };

          const createdSession =
            await this.sessionService.createSession(sessionPayload);

          console.log("createdSession: ", createdSession);

          return {
            status: 200,
            session_id: createdSession.session_id,
            session_exp: createdSession.session_exp,
            access_token: createdSession.access_token,
            access_token_exp: createdSession.access_token_exp,
          };
        } else {
          return {
            status: 500,
            message: "Error occured during creating the user.",
          };
        }
      } else {
        return {
          status: 500,
          message: "Failed to sign up with google",
        };
      }
    } catch (error) {
      console.log("Error: ", error);
      return { status: 500, message: error.message };
    }
  }

  async signupWithFacebook(
    signUpWithFacebookDto: SignUpWithGoogleDto,
    access_token: string,
    device_id: string
  ) {
    console.log("access_token: ", access_token);

    try {
      // Get facebook user data
      const faceebookUserInfo = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
      );

      console.log("faceebookUserInfo: ", faceebookUserInfo.data);

      // let faceebookUserInfo.data = {
      //   id: "122093783361160363",
      //   name: "Nischay Jcasp",
      //   email: "nischay.jcasp@gmail.com",
      //   picture: {
      //     data: {
      //       height: 50,
      //       is_silhouette: true,
      //       url: "https://scontent.famd4-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=2sMfw6QbhjAQ7kNvwEueL0x&_nc_oc=AdnD4W32DYAZPvGXp6GWGb2Yx9iHkU3-zU2jA0kZg1dZSi93exMqAqmTMvMd78XIKkWDbBaco5x0CCJgodCrKw-f&_nc_zt=24&_nc_ht=scontent.famd4-1.fna&edm=AP4hL3IEAAAA&oh=00_AfqKb45xrH91SZ53wupnPIkWgZa5vDyu1HT3BNSRqNODWQ&oe=697EE1D9",
      //       width: 50,
      //     },
      //   },
      // };

      if (faceebookUserInfo.data) {
        // Check if user already registered?
        const findUser = await this.usersRepo.findOne({
          where: { email: faceebookUserInfo.data.email },
        });

        if (findUser) {
          return {
            status: 400,
            message: "User already register with us.",
          };
        }

        // Creating new user
        let tempSignupData = this.usersRepo.create();

        tempSignupData.display_name = faceebookUserInfo.data.name as string;
        tempSignupData.username =
          tempSignupData.display_name.replaceAll(" ", "").toLowerCase() +
          Date.now();
        tempSignupData.email = faceebookUserInfo.data.email as string;
        tempSignupData.primary_account = null;
        tempSignupData.profile_photo =
          faceebookUserInfo.data.picture.data.url ?? null;

        console.log("tempSignupData: ", tempSignupData);

        let createUserRes = await this.usersRepo.save(tempSignupData);

        console.log("createUserRes: ", createUserRes);

        // Create new session for user
        if (createUserRes) {
          const deviceInfo = await DeviceInfo(
            signUpWithFacebookDto.user_agent as string
          );

          console.log("deviceInfo: ", deviceInfo);

          const sessionPayload: SessionData = {
            userId: createUserRes.id,
            device_id,
            device_type: deviceInfo.device.type ?? null,
            device_os: deviceInfo.os.name ?? null,
            device_ip: signUpWithFacebookDto.device_ip as string,
            device_lat: signUpWithFacebookDto.device_lat,
            device_long: signUpWithFacebookDto.device_long,
          };

          const createdSession =
            await this.sessionService.createSession(sessionPayload);

          console.log("createdSession: ", createdSession);

          return {
            status: 200,
            session_id: createdSession.session_id,
            session_exp: createdSession.session_exp,
            access_token: createdSession.access_token,
            access_token_exp: createdSession.access_token_exp,
          };
        } else {
          return {
            status: 500,
            message: "Error occured during creating the user.",
          };
        }
      } else {
        return { status: 500, message: "Failed to sign up with facebook!" };
      }
    } catch (error) {
      console.log("Error: ", error);
      return { status: 500, message: error.message };
    }
  }

  async signupWithLinkedIn(
    signUpWithLinkedInDto: SignUpWithGoogleDto,
    authCode: string,
    device_id: string
  ) {
    try {
      // Get Linked In access token
      const linkedInAccessTokenRes = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: process.env.LINKEDIN_SINGUP_REDIRECT_URI!,
          client_id: process.env.LINKED_IN_CLIENT_ID!,
          client_secret: process.env.LINKED_IN_CLIENT_SECRET!,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("linkedInAccessTokenRes: ", linkedInAccessTokenRes.data);

      // const data: {
      //   access_token: "AQVeq1YiCS0OkrXHCVG7GNnluMVcA-oX5oc6kWp6OatdQcPiu0zij7jUQwy0jsb6oPlYkBcT1QWbMBSpcY0y31qhl8H17CC20Ekp1HUAzskeHbGo4ua32ULJlYoH6SA8NblXbwSGIVXcavW7Ne21OP90QDbnM4gFM0N7-9i-jJON8lcUd8ikfe2a_qMGMhiP4f65L5ZJxNPPiZj3b2grzMhrpAMV-E1FRmd_jgq99oOnj71BO4ZGLQgfZJZzRGj9ujoAjSCeX1shHh7CfNyoNpUt5URuyTtRoJdqeMaWHsEq1mRacUVR0omvslsebuP3Zy1eJ_3hog9SxnC2-4i6hWp5DyVA-Q";
      //   expires_in: 5184000;
      //   scope: "email,openid,profile";
      //   token_type: "Bearer";
      //   id_token: "eyJ6aXAiOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ5Mjk2NjhhLWJhYjEtNGM2OS05NTk4LTQzNzMxNDk3MjNmZiIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vb2F1dGgiLCJhdWQiOiI3OGtvdmV5emk5N2UyeSIsImlhdCI6MTc2NzM1MjcwNywiZXhwIjoxNzY3MzU2MzA3LCJzdWIiOiJEZV9CYV85dHBOIiwibmFtZSI6Ik5pc2NoYXkgSkNhc3AiLCJnaXZlbl9uYW1lIjoiTmlzY2hheSIsImZhbWlseV9uYW1lIjoiSkNhc3AiLCJwaWN0dXJlIjoiaHR0cHM6Ly9tZWRpYS5saWNkbi5jb20vZG1zL2ltYWdlL3YyL0Q0RTAzQVFHWGo5UFFPVkppT0EvcHJvZmlsZS1kaXNwbGF5cGhvdG8tc2hyaW5rXzIwMF8yMDAvQjRFWnJvdmUzZEhFQWMtLzAvMTc2NDg0MTM1Mjk1ND9lPTE3NjkwNDAwMDAmdj1iZXRhJnQ9YURuUjRxUW5lcmV1ejVqZGFhNUJUQXoyZ001LU5xb3VHYXFkTDh5TGsyTSIsImVtYWlsIjoibmlzY2hheS5qY2FzcEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJsb2NhbGUiOiJlbl9VUyJ9.xobtBJiYaKDcf6fQL4aivAEAKE-UZaY3VSj-dkCzczVkabd_2bOkPyjWD4mdFlNGcU6bNl97hjExIRWyDwW7fGfyS-4AOiphLk221a1G1VP6LSDACJGl0SAMnCZZdqBmw4ntBP5ovphROpDlHXG6g95K6Uvuqee3Sxe0UjqwuidKXpA5Td33qptDvCf8_Ih2MZxUo5nOPRc7gWkvE1jjDdkEc7GD-yrTQCRZxwwHPRxPaZ8PVUmn99-WuI7Q-DGX8hsZIzezUO-1i9NJkDX5R_VroF7vioL7VX2R0JQArQTJGp5Vxz7KBuYIXQXMKf7U9KuvBHLRxuzODD_WgTU-OHwBZZdYMno_w7i1zl1QyxqWuq6R66x1FYd4PplIzSqxWb0lETHgqNzApbVyUcecNPZxy3fSvcV2zavPdjGLe9rfjrROgfX7fraDH8-o4cSfmwXQCaDOSulMaN4r7ISDgjDDg6ATj5E3ZuNH16Ub7UQXSzLmwEXP1xdXq7HJKzPM3K0JaYhliF8otVLsZZPlJLZR0rW3vus4b3HDFO9NX-SFB9Pouw5JQFlpzT8ulMpTftMOKCxl0BTgBnb_ySRYI-iwFUHCitmtvGSB3b-g1Xsi6cjsHEbiRh9rrY3jvtNuNpXKyquYvGyUMSCcAWLAyU-50spy_0Jk61HoruA0VKY";
      // };

      if (
        linkedInAccessTokenRes.data &&
        linkedInAccessTokenRes.data.access_token
      ) {
        // Get Linked In User info
        const linkedInProfileRes = await axios.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${linkedInAccessTokenRes.data.access_token}`,
            },
          }
        );

        console.log("linkedInProfileRes: ", linkedInProfileRes.data);

        // const res = {
        //   sub: "De_Ba_9tpN",
        //   email_verified: true,
        //   name: "Nischay JCasp",
        //   locale: {
        //     country: "US",
        //     language: "en",
        //   },
        //   given_name: "Nischay",
        //   family_name: "JCasp",
        //   email: "nischay.jcasp@gmail.com",
        //   picture:
        //     "https://media.licdn.com/dms/image/v2/D4E03AQGXj9PQOVJiOA/profile-displayphoto-shrink_200_200/B4EZrove3dHEAc-/0/1764841352954?e=1769040000&v=beta&t=aDnR4qQnereuz5jdaa5BTAz2gM5-NqouGaqdL8yLk2M",
        // };

        // Check if user already registered?
        const findUser = await this.usersRepo.findOne({
          where: { email: linkedInProfileRes.data.email },
        });

        if (findUser) {
          return {
            status: 400,
            message: "User already register with us.",
          };
        }

        // Creating new user
        let tempSignupData = this.usersRepo.create();

        tempSignupData.display_name = linkedInProfileRes.data.name as string;
        tempSignupData.username =
          tempSignupData.display_name.replaceAll(" ", "").toLowerCase() +
          Date.now();
        tempSignupData.email = linkedInProfileRes.data.email as string;
        tempSignupData.primary_account = null;
        tempSignupData.profile_photo = linkedInProfileRes.data.picture ?? null;

        console.log("tempSignupData: ", tempSignupData);

        let createUserRes = await this.usersRepo.save(tempSignupData);

        console.log("createUserRes: ", createUserRes);

        // Create new session for user
        if (createUserRes) {
          const deviceInfo = await DeviceInfo(
            signUpWithLinkedInDto.user_agent as string
          );

          console.log("deviceInfo: ", deviceInfo);

          const sessionPayload: SessionData = {
            userId: createUserRes.id,
            device_id,
            device_type: deviceInfo.device.type ?? null,
            device_os: deviceInfo.os.name ?? null,
            device_ip: signUpWithLinkedInDto.device_ip as string,
            device_lat: signUpWithLinkedInDto.device_lat,
            device_long: signUpWithLinkedInDto.device_long,
          };

          const createdSession =
            await this.sessionService.createSession(sessionPayload);

          console.log("createdSession: ", createdSession);

          return {
            status: 200,
            session_id: createdSession.session_id,
            session_exp: createdSession.session_exp,
            access_token: createdSession.access_token,
            access_token_exp: createdSession.access_token_exp,
          };
        } else {
          return {
            status: 500,
            message: "Error occured during creating the user.",
          };
        }
      } else {
        return {
          status: 500,
          message: "Failed to sign up with linked in",
        };
      }
    } catch (error) {
      console.log("Error: ", error);
      return { status: 500, message: error.message };
    }
  }

  //<============== Other ==============>

  async refreshToken(session_id: string) {
    // Find session
    const findSession = await this.sessionRepo.findOne({
      where: { id: session_id },
    });

    if (!findSession) {
      return {
        status: 401,
        message: "No active session found.",
      };
    }

    // Check session refresh token expire status
    const verifySession = await this.sessionService.verifyRefreshToken(
      findSession.refresh_token as string
    );

    if (verifySession) {
      // Generate new access token
      const access_token =
        await this.sessionService.genearateAccessToken(session_id);

      const access_token_decoded =
        await this.sessionService.verifyAccessToken(access_token);

      console.log("access_token_decoded: ", access_token_decoded);

      if (!access_token_decoded) {
        throw new InternalServerErrorException(
          "access token expired already!!"
        );
      }

      return {
        status: 200,
        access_token,
        access_token_exp: new Date(access_token_decoded.exp * 1000),
      };
    } else {
      return {
        status: 500,
        message: "Session expired, please login again!",
      };
    }
  }
}
