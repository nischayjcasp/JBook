import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UploadStatus {
  UPLOADED = "uploaded",
  DELETED = "deleted",
}

@Entity("upload_logs")
export class UploadLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  post_id: string | null;

  @Column({
    type: "enum",
    enum: UploadStatus,
  })
  status: UploadStatus;

  @Column()
  asset_id: string;

  @Column()
  public_id: string;

  @Column()
  signature: string;

  @Column()
  resource_type: string;

  @Column({
    type: "timestamptz",
  })
  uploaded_at: Date;

  @Column()
  bytes: number;

  @Column()
  secure_url: string;

  @Column()
  asset_folder: string;

  @Column()
  file_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
