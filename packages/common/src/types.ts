export interface Response<T> {
  data: T;
}

export interface Page {
  num: number;
  size: number;
}

export interface PaginatedData<T> {
  data: T[];
  nextPage?: Page;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { next?: string };
}

export interface ModelStatusResponse {
  id: string,
  name: string,
  status: 'Pending' | 'Generated' | 'Failed',
  thumbnail: string | null,
  createdAt: Date,
  updatedAt: Date,
}

export interface FalAiWebhookPayload {
  images: [
    {
      url: string;
      content_type: string;
      file_name: string;
      file_size: number;
      width: number;
      height: number;
    },
  ];
  seed: number;
}


/**
 * Represents the response from a WebHook request.
 * This is a union type that varies based on the `status` property.
 *
 * @template Payload - The type of the payload in the response. It defaults to `any`,
 * allowing for flexibility in specifying the structure of the payload.
 */
export type FalAiWebHookResponse = {
  /** Indicates a successful response. */
  status: "OK";
  /** The payload of the response, structure determined by the Payload type. */
  payload: FalAiWebhookPayload;
  /** Error is never present in a successful response. */
  error: never;
  /** The unique identifier for the request. */
  request_id: string;
} | {
  /** Indicates an unsuccessful response. */
  status: "ERROR";
  /** The payload of the response, structure determined by the Payload type. */
  payload: FalAiWebhookPayload;
  /** Description of the error that occurred. */
  error: string;
  /** The unique identifier for the request. */
  request_id: string;
};
