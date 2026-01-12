import { HfInference } from "@huggingface/inference";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmbeddingsService {
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HF_API_KEY);
  }

  async embedText(text: string) {
    const embeddingRes = await this.hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    // console.log("embeddingRes: ", embeddingRes);

    return embeddingRes as number[];
  }
}
