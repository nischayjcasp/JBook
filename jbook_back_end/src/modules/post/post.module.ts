import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { UploadLog } from "./entities/uploadLog.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, UploadLog])],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule, PostService],
})
export class PostModule {}
