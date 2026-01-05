import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailLogs, EmailStatus } from "./entities/emailLog.entity";
import { Repository } from "typeorm";
import { SentEmailDto } from "./dto/sentEmail.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { SessionService } from "../session/session.service";
import * as bcrypt from "bcrypt";
import { convert } from "html-to-text";
import { ResetPasswordLog } from "../auth/entities/resetPassword.entity";
import { ForgotPasswordDto } from "../auth/dto/forgotPassword.dto";
import { DeviceInfo } from "src/common/utils/deviceInfo.utils";

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailLogs)
    private readonly emailLogRepo: Repository<EmailLogs>,
    @InjectRepository(ResetPasswordLog)
    private readonly resetPasswordRepo: Repository<ResetPasswordLog>,
    private readonly mailService: MailerService,
    private readonly sessionService: SessionService
  ) {}

  async sentWelcomEmail(sentEmailDto: Partial<SentEmailDto>) {
    const emailResp = await this.mailService.sendMail({
      from: `Merger App <${process.env.GOOGLE_FROM_EMAIL}>`,
      to: sentEmailDto.address_to,
      subject: `Welcome to Merger App!`,
      text: sentEmailDto.message,
    });

    // console.log("emailResp: ", emailResp);

    return emailResp;
  }

  async sentResetPasswordLink(
    sentResetEmailDto: ForgotPasswordDto,
    user_id: string,
    userAgent: string,
    device_id: string
  ) {
    let deviceInfo: any | null = null;

    try {
      const resetToken = await this.sessionService.genearateResetPasswordToken(
        sentResetEmailDto.forgot_pass_email
      );

      const resetToken_decoded =
        await this.sessionService.verifyResetPasswordToken(resetToken);

      if (!resetToken_decoded) {
        throw new InternalServerErrorException(
          "Error occured while generating resetToken!"
        );
      }

      const token_hash = await bcrypt.hash(resetToken, 10);

      console.log("token_hash: ", token_hash);

      const resetLink = "http://localhost:3000/resetpass?code=" + token_hash;

      const resetLinkEmailHTML = `
      <html>
        <body>
            <p>Merger App, Password reset</p>
            <br/>
            <a href="${resetLink}">Reset your password</a>
            <br/>
            <p>If you didn't request a password reset, ignore this email. Your password will stay the same.</p>
            <br/>
            <p>Merger App - Jcasp Technologies</p>
        </body>
      </html>
      `;

      const emailResp = await this.mailService.sendMail({
        from: `Merger App <${process.env.GOOGLE_FROM_EMAIL}>`,
        to: sentResetEmailDto.forgot_pass_email,
        subject: `Reset your Merger App password`,
        html: resetLinkEmailHTML,
      });

      if (emailResp.messageId) {
        // Creating Email log
        const html2textOptions = {
          wordWrap: 130,
          selectors: [{ selector: "img", format: "skip" }],
        };
        const emailMessageText = convert(resetLinkEmailHTML, html2textOptions);

        console.log("emailMessageText: ", emailMessageText);

        const tempEmailLog = this.emailLogRepo.create();

        tempEmailLog.address_to = sentResetEmailDto.forgot_pass_email;
        tempEmailLog.message = emailMessageText;
        tempEmailLog.sent_at = new Date(Date.now());
        tempEmailLog.status = EmailStatus.SENT;

        const createEmailLog = await this.emailLogRepo.save(tempEmailLog);

        if (!createEmailLog) {
          return {
            status: 500,
            message: "Error occured while creating email log.",
          };
        }

        console.log("createEmailLog: ", createEmailLog);

        //Get device information
        if (userAgent) {
          deviceInfo = await DeviceInfo(userAgent);
        }

        console.log("deviceInfo: ", deviceInfo);

        // Create Reset password log
        const temprestPasswordLog = this.resetPasswordRepo.create();

        temprestPasswordLog.email_log_id = createEmailLog.id;
        temprestPasswordLog.user_id = user_id;
        temprestPasswordLog.token_hash = token_hash;
        temprestPasswordLog.expires_at = new Date(
          parseInt(resetToken_decoded.exp) * 1000
        );
        temprestPasswordLog.is_token_used = false;
        temprestPasswordLog.device_id = device_id;
        temprestPasswordLog.device_type = deviceInfo.device.type ?? null;
        temprestPasswordLog.device_os = deviceInfo.os.name ?? null;
        temprestPasswordLog.device_ip = sentResetEmailDto.device_ip;
        temprestPasswordLog.device_lat = sentResetEmailDto.device_lat;
        temprestPasswordLog.device_long = sentResetEmailDto.device_long;

        const createResetPasswordLog =
          await this.resetPasswordRepo.save(temprestPasswordLog);

        if (!createResetPasswordLog) {
          return {
            status: 500,
            message: "Error occured while creating reset password log.",
          };
        }

        console.log("createResetPasswordLog: ", createResetPasswordLog);

        return { status: 200 };
      } else {
        return {
          status: 500,
          message: "Failed to sent reset link email",
        };
      }
    } catch (error) {
      console.log("sentResetPasswordLink-Error: ", error);
      return {
        status: 500,
        message: error.message,
      };
    }
  }
}
