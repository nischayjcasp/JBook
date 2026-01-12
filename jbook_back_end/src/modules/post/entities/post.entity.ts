import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  post_title: string;

  @Column()
  post_text: string;

  @Column({ type: "text", nullable: true })
  post_image: string | null;

  @Column({
    type: "vector",
    length: 384,
    nullable: true,
  })
  embedding: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
