export abstract class BaseModel {
  abstract generateImage(
    prompt: string,
    tensorPath: string,
  ): Promise<{ requestId: string; responseUrl: string }>;
  abstract trainModel(
    zipUrl: string,
    triggerWord: string,
  ): Promise<{ requestId: string; responseUrl: string }>;

  abstract generateThumbnailImage(
    tensorPath: string,
  ): Promise<{ imageUrl: string }>;
}
