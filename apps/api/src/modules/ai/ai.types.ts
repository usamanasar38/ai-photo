export interface ImageAiModel {
  generateImage(
    prompt: string,
    tensorPath: string,
  ): Promise<{ requestId: string; responseUrl: string }>;
  trainModel(
    zipUrl: string,
    triggerWord: string,
  ): Promise<{ requestId: string; responseUrl: string }>;

  generateThumbnailImage(tensorPath: string): Promise<{ imageUrl: string }>;
}
