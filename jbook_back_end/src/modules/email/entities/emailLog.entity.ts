import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum EmailStatus {
  NOTSENT = "notsent",
  SENT = "sent",
  PENDING = "pending",
  FAILED = "failed",
}

export enum EmailType {
  WELCOME = "welcome",
  OTPEMAIL = "otpemail",
  OTPMOBILE = "otpmobile",
  RESETPASS = "resetpass",
  OTHER = "other",
}

@Entity("email_logs")
export class EmailLogs {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamptz" })
  sent_at: Date | null;

  @Column({
    type: "enum",
    enum: EmailType,
    default: EmailType.OTHER,
  })
  email_type: EmailType;

  @Column()
  address_to: string;

  @Column({
    type: "enum",
    enum: EmailStatus,
    default: EmailStatus.NOTSENT,
  })
  status: EmailStatus;

  @Column()
  message: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
