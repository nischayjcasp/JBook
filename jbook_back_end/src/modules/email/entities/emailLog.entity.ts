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

@Entity("email_logs")
export class EmailLogs {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamptz" })
  sent_at: Date | null;

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
