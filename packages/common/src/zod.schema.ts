import { z } from "zod";
import {
  ETHNICITY_ARRAY,
  EYE_COLOR_ARRAY,
  GENDER_TYPE_ARRAY,
} from "./constants";

export const TrainModel = z.object({
  name: z.string(),
  type: z.enum(GENDER_TYPE_ARRAY),
  age: z.number({
    coerce: true,
  }),
  ethnicity: z.enum(ETHNICITY_ARRAY),
  eyeColor: z.enum(EYE_COLOR_ARRAY),
  bald: z.boolean({
    coerce: true,
  }),
  zipUrl: z.string().url(),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GenerateImagesFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
