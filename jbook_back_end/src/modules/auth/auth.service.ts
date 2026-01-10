import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { LoginWithEmailDto } from "./dto/loginWithEmail.dto";
import { SignUpWithEmailDto } from "./dto/signUpWithEmail.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AccountStatus, Users } from "../users/entities/user.entity";
import { SessionService } from "../session/session.service";
import { SessionData } from "../session/session.type";
import axios from "axios";
import { DeviceInfo } from "src/common/utils/deviceInfo.utils";
import {
  FailedLoginLogData,
  GoogleTokenResType,
  GoogleUserInfoType,
  SignUpResType,
} from "./auth.type";
import { SignUpWithGoogleDto } from "./dto/signUpWithGoogle.dto";
import {
  SessionStatus,
  UserSession,
} from "../session/entities/user_session.entity";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto";
import { EmailService } from "../email/email.service";
import { ResetPasswordDto } from "./dto/resetPassword.dro";
import { ResetPasswordLog } from "./entities/resetPassword.entity";
import { UsersService } from "../users/users.service";
import { FailedLoginLog } from "./entities/failedLoginLog.entity";
import { ConfigService } from "@nestjs/config";
import { LoginWithOtpDto } from "./dto/loginWithOtp.dto";
import { OTP } from "./entities/otp.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(ResetPasswordLog)
    private readonly resetPassRepo: Repository<ResetPasswordLog>,
    @InjectRepository(FailedLoginLog)
    private readonly failedLoginLogRepo: Repository<FailedLoginLog>,
    @InjectRepository(OTP)
    private readonly otpRepo: Repository<OTP>,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  //<============== Failed logn attempt log ==============>
  async failedLoginLog(failedLoginLogData: FailedLoginLogData) {
    try {
      // Get Device information
      let deviceInfo: any = null;

      //Get device information
      if (failedLoginLogData.user_agent) {
        deviceInfo = await DeviceInfo(failedLoginLogData.user_agent);
      }

      console.log("deviceInfo: ", deviceInfo);

      const tempFailedLoginLogRes = this.failedLoginLogRepo.create({
        user_id: failedLoginLogData.user_id,
        device_id: failedLoginLogData.device_id,
        device_os: deviceInfo.os.name ?? null,
        device_type: deviceInfo.device.type ?? null,
        device_ip: failedLoginLogData.device_ip,
        device_lat: failedLoginLogData.device_lat,
        device_long: failedLoginLogData.device_long,
      });

      const FailedLoginLogRes = await this.failedLoginLogRepo.save(
        tempFailedLoginLogRes
      );

      // Calculate block time
      const maxAttemps = this.configService.get("MAX_FAILED_ATTEMPTS");
      const todayStart = new Date(Date.now());
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date(Date.now());
      todayEnd.setHours(23, 59, 59, 999);

      const failedLogs = await this.failedLoginLogRepo.find({
        where: {
          user_id: failedLoginLogData.user_id,
          created_at: Between(todayStart, todayEnd),
        },
      });

      console.log("failedLogs.length", failedLogs.length);

      const blockMul = failedLogs.length / maxAttemps;

      // Check and block user if necessary
      if (Number.isInteger(blockMul)) {
        console.log("blockTime: ", blockMul * maxAttemps, "min");

        const finduser = await this.usersRepo.findOne({
          where: {
            id: failedLoginLogData.user_id,
          },
        });

        if (!finduser) {
          return {
            status: 401,
            message: "Incorrect credentials!",
          };
        }

        finduser.status = AccountStatus.BLOCKED;
        finduser.block_expires_at = new Date(
          Date.now() + blockMul * maxAttemps * 60 * 1000
        );

        const updatedUser = await this.usersRepo.save(finduser as Users);

        return {
          status: 429,
          message: `Account is blocked till ${new Date(updatedUser.block_expires_at as Date).toLocaleString()}`,
        };
      } else {
        console.log("blockMul: ", blockMul);
        return {
          status: 401,
          message: "Incorrect credentials!",
        };
      }
    } catch (error) {
      console.log("Error", error);
      throw new InternalServerErrorException(
        "Error occured while updating failed login log."
      );
    }
  }

  //<============== Login ==============>

  async loginWithEmail(
    loginWithEmailDto: LoginWithEmailDto,
    device_id: string | null | undefined
  ): Promise<SignUpResType> {
    if (!device_id) {
      console.log("No device id, new device");

      device_id = crypto.randomUUID();
    }

    try {
      // finduser in DB
      const finduser = await this.usersRepo.findOne({
        where: {
          email: loginWithEmailDto.email,
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

      if (finduser.status === AccountStatus.BLOCKED) {
        if (
          new Date(finduser.block_expires_at as Date) >= new Date(Date.now())
        ) {
          return {
            status: 429,
            message: `Account is blocked till ${new Date(finduser.block_expires_at as Date).toLocaleString()}`,
          };
        } else {
          finduser.status = AccountStatus.ACTIVE;
          finduser.block_expires_at = null;

          await this.usersRepo.save(finduser as Users);
        }
      }

      //Check credentials
      const isMatching = await bcrypt.compare(
        loginWithEmailDto.password,
        finduser.password
      );

      if (!isMatching) {
        const failedLogsRes = await this.failedLoginLog({
          user_id: finduser.id,
          device_id,
          user_agent: loginWithEmailDto.user_agent,
          device_ip: loginWithEmailDto.device_ip,
          device_lat: loginWithEmailDto.device_lat,
          device_long: loginWithEmailDto.device_long,
        });

        return failedLogsRes;
      }

      // Check for whether it is new device
      const isNewDevice = await this.newDeviceVerification({
        userId: finduser.id,
        user_agent: loginWithEmailDto.user_agent,
        device_id,
        device_ip: loginWithEmailDto.device_ip as string,
        device_lat: loginWithEmailDto.device_lat,
        device_long: loginWithEmailDto.device_long,
      });

      console.log("isNewDevice: ", isNewDevice);

      const sessionPayload: SessionData = {
        userId: finduser.id,
        device_id,
        user_agent: loginWithEmailDto.user_agent,
        device_ip: loginWithEmailDto.device_ip,
        device_lat: loginWithEmailDto.device_lat,
        device_long: loginWithEmailDto.device_long,
      };

      if (isNewDevice?.status) {
        sessionPayload.sessionStatus = SessionStatus.BLOCKED;
      }

      const createdSession =
        await this.sessionService.createSession(sessionPayload);

      console.log("createdSession: ", createdSession);

      return {
        status: 200,
        user_id: finduser.id,
        device_id: isNewDevice?.status ? device_id : undefined,
        otp_id: isNewDevice?.otp_id,
        otp_message: `Sent you otp on ${finduser.email}`,
        session_id: createdSession.session_id,
        session_exp: createdSession.session_exp,
        access_token: createdSession.access_token,
        access_token_exp: createdSession.access_token_exp,
      };
    } catch (error) {
      console.log("Error: ", error);

      return {
        status: 500,
        message: "Internal server error: loginWithEmail",
      };
    }
  }

  async loginWithGoogle(
    loginWithGoogleDto: SignUpWithGoogleDto,
    authCode: string,
    access_token: string | null,
    device_id: string
  ) {
    // Get Api to verify google access_token
    // https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=

    console.log("authCode: ", authCode);

    try {
      let googleTokenRes: any | { data: { access_token: string | null } } = {
        data: {
          access_token,
        },
      };

      if (!access_token) {
        // Get google access token
        googleTokenRes = await axios.post<Partial<GoogleTokenResType>>(
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

        console.log("API-googleTokenRes: ", googleTokenRes.data);
      }

      console.log(
        googleTokenRes.data,
        googleTokenRes.data.access_token,
        googleTokenRes.data && googleTokenRes.data.access_token
      );

      // Get google user data from access_token
      if (googleTokenRes.data && googleTokenRes.data.access_token) {
        console.log(
          "googleTokenRes.data.access_token: ",
          googleTokenRes.data.access_token
        );

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
          user_agent: loginWithGoogleDto.user_agent,
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

      if (error.status === 400 || error.status === 401) {
      }
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
          user_agent: loginWithFacebookDto.user_agent,
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
    access_token: string | null,
    device_id: string
  ) {
    try {
      console.log("authCode: ", authCode);

      let linkedInAccessTokenRes:
        | any
        | { data: { access_token: string | null } } = {
        data: {
          access_token,
        },
      };

      if (!access_token) {
        // Get Linked In access token
        linkedInAccessTokenRes = await axios.post(
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
      }

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
          user_agent: loginWithLinkedInDto.user_agent,
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

  async loginWithOtp(
    loginWithOtpDto: LoginWithOtpDto,
    userAgent: string | undefined,
    device_id: string,
    session_id: string
  ) {
    try {
      // verify otp
      const findOtp = await this.otpRepo.findOne({
        where: {
          id: loginWithOtpDto.otp_id,
        },
      });

      if (!findOtp) {
        return {
          status: 400,
          message: "OTP id do not found",
        };
      }

      console.log("findOtp: ", findOtp);

      const isOtpValid =
        findOtp.otp === loginWithOtpDto.otp &&
        findOtp.expires_at > new Date(Date.now()) &&
        !findOtp.is_otp_used;

      console.log(
        findOtp.otp === loginWithOtpDto.otp,
        findOtp.expires_at > new Date(Date.now()),
        !findOtp.is_otp_used
      );

      console.log(findOtp.otp, loginWithOtpDto.otp);
      console.log(findOtp.expires_at, new Date(Date.now()));
      console.log(findOtp.is_otp_used);

      if (isOtpValid) {
        const findSession = await this.sessionRepo.findOne({
          where: { id: session_id },
        });

        if (!findSession) {
          return {
            status: 500,
            message: "Session do not found!",
          };
        }

        //Check if it is the same device from which otp is reuqested
        if (findSession.device_id !== device_id) {
          return {
            status: 401,
            message: "Device is different then from which otp was requested!",
          };
        }

        // Update session
        findSession.status = SessionStatus.ACTIVE;

        const updateSession = await this.sessionRepo.save(findSession);

        //Update otp log
        findOtp.is_otp_used = true;

        await this.otpRepo.save(findOtp);

        // Generating access token
        const access_token = await this.sessionService.genearateAccessToken(
          updateSession.id
        );

        console.log("access_token: ", access_token);

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
          user_id: findSession.user_id,
          access_token,
          access_token_exp: new Date(access_token_decoded.exp * 1000),
        };
      } else {
        return {
          status: 400,
          message: "Invalid OTP!",
        };
      }
    } catch (error) {
      console.log("error: ", error);

      throw new InternalServerErrorException(error.message);
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
  ): Promise<SignUpResType> {
    try {
      const createUserRes = await this.usersService.createUser({
        display_name: signUpWithEmailDto.display_name,
        dob: signUpWithEmailDto.dob,
        gender: signUpWithEmailDto.gender,
        mobile_no: signUpWithEmailDto.mobile_no,
        email: signUpWithEmailDto.email,
        password: signUpWithEmailDto.password,
      });

      console.log("createUserRes: ", createUserRes);

      // Create new session for user
      if (createUserRes && createUserRes.status === 201 && createUserRes.user) {
        const sessionPayload: SessionData = {
          userId: createUserRes.user.id as string,
          device_id: device_id,
          user_agent: signUpWithEmailDto.user_agent as string,
          device_ip: signUpWithEmailDto.device_ip as string,
          device_lat: signUpWithEmailDto.device_lat,
          device_long: signUpWithEmailDto.device_long,
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
        if (createUserRes && createUserRes.status === 500) {
          return {
            status: 500,
            message: "Error occured during creating the user.",
          };
        } else {
          return createUserRes;
        }
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
    access_token: string | null,
    device_id: string
  ): Promise<SignUpResType> {
    console.log("authCode: ", authCode);

    try {
      let googleTokenRes: any | { data: { access_token: string | null } } = {
        data: {
          access_token,
        },
      };

      if (!access_token) {
        // Get google access token
        googleTokenRes = await axios.post<Partial<GoogleTokenResType>>(
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

        console.log("API-googleTokenRes: ", googleTokenRes.data);
      }

      console.log(
        googleTokenRes.data,
        googleTokenRes.data.access_token,
        googleTokenRes.data && googleTokenRes.data.access_token
      );

      // Get google user data from access_token
      if (googleTokenRes.data && googleTokenRes.data.access_token) {
        console.log(
          "googleTokenRes.data.access_token: ",
          googleTokenRes.data.access_token
        );

        const googleUserInfo = await axios.get<Partial<GoogleUserInfoType>>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${googleTokenRes.data.access_token}`,
            },
          }
        );

        console.log("googleUserInfo: ", googleUserInfo.data);

        const createUserRes = await this.usersService.createUser(
          {
            display_name: googleUserInfo.data.name as string,
            email: googleUserInfo.data.email as string,
            profile_photo: googleUserInfo.data.picture ?? null,
          },
          googleTokenRes.data.access_token
        );

        console.log("createUserRes: ", createUserRes);

        // Create new session for user
        if (
          createUserRes &&
          createUserRes.status === 201 &&
          createUserRes.user
        ) {
          const sessionPayload: SessionData = {
            userId: createUserRes.user.id,
            device_id,
            user_agent: signUpWithGoogleDto.user_agent,
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
          if (createUserRes && createUserRes.status === 500) {
            return {
              status: 500,
              message: "Error occured during creating the user.",
            };
          } else {
            return createUserRes;
          }
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
  ): Promise<SignUpResType> {
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
        const createUserRes = await this.usersService.createUser(
          {
            display_name: faceebookUserInfo.data.name as string,
            email: faceebookUserInfo.data.email as string,
            profile_photo: faceebookUserInfo.data.picture.data.url ?? null,
          },
          access_token
        );

        console.log("createUserRes: ", createUserRes);

        // Create new session for user
        if (
          createUserRes &&
          createUserRes.status === 201 &&
          createUserRes.user
        ) {
          const sessionPayload: SessionData = {
            userId: createUserRes.user.id,
            device_id,
            user_agent: signUpWithFacebookDto.user_agent,
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
          if (createUserRes && createUserRes.status === 500) {
            return {
              status: 500,
              message: "Error occured during creating the user.",
            };
          } else {
            return createUserRes;
          }
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
    access_token: string | null,
    device_id: string
  ): Promise<SignUpResType> {
    try {
      let linkedInAccessTokenRes:
        | any
        | { data: { access_token: string | null } } = {
        data: {
          access_token,
        },
      };

      if (!access_token) {
        // Get Linked In access token
        linkedInAccessTokenRes = await axios.post(
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
      }

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

        const createUserRes = await this.usersService.createUser(
          {
            display_name: linkedInProfileRes.data.name as string,
            email: linkedInProfileRes.data.email as string,
            profile_photo: linkedInProfileRes.data.picture ?? null,
          },
          linkedInAccessTokenRes.data.access_token
        );

        console.log("createUserRes: ", createUserRes);

        // Create new session for user
        if (
          createUserRes &&
          createUserRes.status === 201 &&
          createUserRes.user
        ) {
          const sessionPayload: SessionData = {
            userId: createUserRes.user.id,
            device_id,
            user_agent: signUpWithLinkedInDto.user_agent,
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
          if (createUserRes && createUserRes.status === 500) {
            return {
              status: 500,
              message: "Error occured during creating the user.",
            };
          } else {
            return createUserRes;
          }
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

    if (findSession.status !== SessionStatus.ACTIVE) {
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

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    userAgent: string,
    device_id: string
  ) {
    try {
      // finduser in DB
      const finduser = await this.usersRepo.findOne({
        where: {
          email: forgotPasswordDto.forgot_pass_email,
        },
      });

      if (!finduser) {
        return {
          status: 400,
          message: "User is not registered!",
        };
      }

      console.log("finduser: ", finduser, userAgent, device_id);

      // Sent reset password email
      const emailResp = await this.emailService.sentResetPasswordLink(
        forgotPasswordDto,
        finduser.id,
        userAgent,
        device_id
      );

      console.log("emailResp: ", emailResp);

      if (emailResp.status === 200) {
        return {
          status: 200,
          message: `Reset link sent to ${forgotPasswordDto.forgot_pass_email}`,
        };
      } else {
        return emailResp;
      }
    } catch (error) {
      console.log("Error: ", error);
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    userAgent: string,
    resetCode: string,
    device_id: string
  ) {
    try {
      // finduser in DB
      const findCode = await this.resetPassRepo.findOne({
        where: {
          token_hash: resetCode,
        },
      });

      if (!findCode) {
        return {
          status: 401,
          message: "Unauthorized request!",
        };
      }

      // vetify resetCode expiry
      const isCodeValid =
        new Date(Date.now()) < findCode.expires_at && !findCode.is_token_used;

      if (!isCodeValid) {
        return {
          status: 400,
          message: "Your password reset link is invalid!",
        };
      }

      //Find user password
      const findUser = await this.usersRepo.findOne({
        where: {
          id: findCode.user_id,
        },
      });

      if (!findUser) {
        return {
          status: 400,
          message: "User do not found!",
        };
      }

      //Find user password
      const updateUserRes = await this.usersService.updateUser(findUser.id, {
        password: resetPasswordDto.new_pass,
      });

      if (updateUserRes && updateUserRes.status === 200) {
        // update reset password log
        findCode.is_token_used = true;

        const resetPasswordLog = await this.resetPassRepo.save(findCode);

        if (!resetPasswordLog) {
          return {
            status: 500,
            message: "Error occured while updating reseting password logs.",
          };
        }

        return {
          status: 200,
          message: "Your password updated successfully",
        };
      } else {
        return updateUserRes;
      }
    } catch (error) {
      console.log("Error: ", error);
      return {
        status: 500,
        message: "Error occured while reseting password the user.",
        error_message: error.message,
      };
    }
  }

  async newDeviceVerification(emailVerifyPayload: SessionData) {
    try {
      let deviceInfo: any = null;

      //Get device information
      if (emailVerifyPayload.user_agent) {
        deviceInfo = await DeviceInfo(emailVerifyPayload.user_agent);
      }

      console.log("deviceInfo: ", deviceInfo);

      console.log("emailVerifyPayload.userId: ", emailVerifyPayload.userId);
      console.log(
        "emailVerifyPayload.device_id: ",
        emailVerifyPayload.device_id
      );

      const findSessions = await this.sessionRepo.find({
        where: {
          user_id: emailVerifyPayload.userId,
          device_id: emailVerifyPayload.device_id,
        },
      });

      console.log("findSessions: ", findSessions);

      const findUser = await this.usersRepo.findOne({
        where: {
          id: emailVerifyPayload.userId,
        },
      });

      console.log("findUser: ", findUser);

      const isNewDevice = findSessions.length > 0 ? false : true;

      if (isNewDevice) {
        const otpMailRes = await this.emailService.sentOtp({
          email: findUser?.email as string,
        });

        console.log(
          "New device: ",
          emailVerifyPayload.device_id,
          "otp: ",
          otpMailRes
        );

        if (otpMailRes.status === 200) {
          return {
            status: true,
            otp_id: otpMailRes.otp_id,
          };
        }
      } else {
        return {
          status: false,
        };
      }
    } catch (error) {
      console.log("Error: ", error);

      throw new InternalServerErrorException(
        "Error occued while checking device verification"
      );
    }
  }

  async resendOtp(
    session_id: string,
    device_id: string
  ): Promise<SignUpResType> {
    // check session status
    const findSessions = await this.sessionRepo.findOne({
      where: {
        id: session_id,
      },
    });

    if (!findSessions) {
      return {
        status: 400,
        message: "Session do not founds!",
      };
    }

    // finduser in DB
    const finduser = await this.usersRepo.findOne({
      where: {
        id: findSessions.user_id,
      },
    });

    if (!finduser) {
      return {
        status: 401,
        message: "Invalid session!",
      };
    }

    if (findSessions.status === SessionStatus.BLOCKED) {
      const otpMailRes = await this.emailService.sentOtp({
        email: finduser.email,
      });

      console.log("otp: ", otpMailRes);

      if (otpMailRes.status === 200) {
        return {
          status: 200,
          otp_id: otpMailRes.otp_id as string,
          otp_message: `Otp sent to ${finduser.email}`,
        };
      } else {
        return {
          status: 500,
          message: "Error occured while sending OTP!",
        };
      }
    } else {
      return {
        status: 500,
        message: "Invalid Otp request!",
      };
    }
  }
}
