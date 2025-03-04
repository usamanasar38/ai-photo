import { fal } from '@fal-ai/client';
import { BaseModel } from './base.model';

export class FalAIModel extends BaseModel {
  private readonly imageTrainingModel = 'fal-ai/flux-lora-fast-training';
  private readonly imageGenerationModel = 'fal-ai/flux-lora';
  private readonly weightScale = 1;

  public async generateImage(prompt: string, tensorPath: string) {
    const { request_id, response_url } = await fal.queue.submit(
      this.imageGenerationModel,
      {
        input: {
          prompt: prompt,
          loras: [{ path: tensorPath, scale: this.weightScale }],
        },
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`,
      },
    );

    return { requestId: request_id, responseUrl: response_url };
  }

  public async trainModel(zipUrl: string, triggerWord: string) {
    const { request_id, response_url } = await fal.queue.submit(
      this.imageTrainingModel,
      {
        input: {
          images_data_url: zipUrl,
          trigger_word: triggerWord,
        },
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`,
      },
    );

    return { requestId: request_id, responseUrl: response_url };
  }

  public async generateThumbnailImage(tensorPath: string) {
    const response = await fal.subscribe(this.imageGenerationModel, {
      input: {
        prompt:
          'Generate a head shot for this user in front of a white background',
        loras: [{ path: tensorPath, scale: this.weightScale }],
      },
    });
    return {
      imageUrl: response.data.images[0].url,
    };
  }

  public getRequestResultFromQueue(requestId: string) {
    return fal.queue.result(this.imageGenerationModel, {
      requestId,
    })
  };
}
