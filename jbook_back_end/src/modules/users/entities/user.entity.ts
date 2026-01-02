import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  primary_account: string | null;

  @Column({ unique: true })
  username: string;

  @Column()
  display_name: string;

  @Column({ type: "text", nullable: true })
  profile_photo: string | null;

  @Column({
    type: "date",
    transformer: {
      from: (value: string) => new Date(value),
      to: (value: Date) => (value ? value.toISOString().split("T") : null),
    },
    nullable: true,
  })
  dob: Date | null;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: true,
  })
  gender: Gender | null;

  @Column({ unique: true })
  email: string;

  @Column({
    type: "text",
    nullable: true,
  })
  mobile_no: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  password: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: string;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: string;
}
