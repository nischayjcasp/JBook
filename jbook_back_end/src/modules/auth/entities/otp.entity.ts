import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("otp")
export class OTP {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  email_log_id: string;

  @Column()
  otp: string;

  @Column()
  is_otp_used: boolean;

  @Column({ type: "timestamptz" })
  expires_at: Date;

  @Column({ type: "text", nullable: true })
  device_id: string | null;

  @Column({ type: "text", nullable: true })
  device_type: string | null;

  @Column({ type: "text", nullable: true })
  device_os: string | null;

  @Column({ type: "text", nullable: true })
  device_ip: string | null;

  @Column({ type: "text", nullable: true })
  device_lat: number | null;

  @Column({ type: "text", nullable: true })
  device_long: number | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
