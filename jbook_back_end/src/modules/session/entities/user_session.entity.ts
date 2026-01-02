import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum SessionStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  EXPIRED = "expired",
}

@Entity("user_session")
export class UserSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @Column({
    type: "enum",
    enum: SessionStatus,
    default: SessionStatus.BLOCKED,
  })
  status: SessionStatus;

  @Column({ type: "text", nullable: true })
  refresh_token: string | null;

  @Column({ type: "date", nullable: true })
  expires_at: Date | null;

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
