import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("delete_acc_logs")
export class DeleteUserLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  session_id: string;

  @Column({ type: "text", nullable: true })
  reason_for_delete: string | null;

  @Column()
  user_consent: boolean;

  @CreateDateColumn()
  created_at: Date;
}
