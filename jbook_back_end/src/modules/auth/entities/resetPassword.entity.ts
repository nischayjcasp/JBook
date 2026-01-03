import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("reset_password_logs")
export class ResetPasswordLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  email_log_id: string;

  @Column()
  token_hash: string;

  @Column()
  is_token_used: boolean;

  @Column({ type: "timestamptz" })
  expires_at: Date;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
