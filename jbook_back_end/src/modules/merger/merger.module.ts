import { Module } from "@nestjs/common";
import { MergerService } from "./merger.service";
import { MergerController } from "./merger.controller";
import { EmbeddingsModule } from "../embeddings/embeddings.module";
import { Post } from "../post/entities/post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [EmbeddingsModule, TypeOrmModule.forFeature([Post])],
  controllers: [MergerController],
  providers: [MergerService],
})
export class MergerModule {}
