import { pipeline,env,type FeatureExtractionPipeline } from "@huggingface/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

let embedderInstance: FeatureExtractionPipeline | null = null;

export const getEmbedder = async (): Promise<FeatureExtractionPipeline> => {
  if (!embedderInstance) {
    embedderInstance = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderInstance;
};

export const getEmbedding = async (text:string): Promise<number[]> => {
    const embedder = await getEmbedder();
    const output = await embedder(text, {pooling: "mean", normalize: true});
    return Array.from(output.data);
}