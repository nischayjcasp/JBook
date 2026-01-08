import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("failed_login_logs")
export class FailedLoginLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

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
}
