import { Injectable } from "@nestjs/common";
import { EmbeddingsService } from "../embeddings/embeddings.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../post/entities/post.entity";
import { Repository } from "typeorm";
import { CompareDataDto } from "./entities/compareData.dto";

@Injectable()
export class MergerService {
  constructor(
    private readonly embeddingService: EmbeddingsService,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>
  ) {}

  async findDubplicatePost(
    embedding: number[],
    secondary_user_id: string,
    post_id: string
  ) {
    const vectorLiteral = `[${embedding.join(",")}]`;

    return this.postRepo.query(
      `
      SELECT
        id,
        1 - (embedding <=> $1::vector) AS similarity
      FROM posts
      WHERE id != $2
        AND user_id = $4
        AND 1 - (embedding <=> $1::vector) >= $3
      ORDER BY embedding <=> $1::vector
      `,
      [vectorLiteral, post_id, 0.7, secondary_user_id]
    );
  }

  async mergerCompareData(compareDataDto: CompareDataDto) {
    let report = {};

    console.log("compareDataDto: ", compareDataDto);

    const primaryUserPost = await this.postRepo.find({
      where: {
        user_id: compareDataDto.primaryAcc,
      },
    });

    await Promise.all(
      primaryUserPost.map(async (p) => {
        const duplicates = await this.findDubplicatePost(
          p.embedding,
          compareDataDto.secondaryAcc,
          p.id
        );

        report[p.id] = duplicates;
      })
    );

    return {
      status: 200,
      report,
    };
  }
}
