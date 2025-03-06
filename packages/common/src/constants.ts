export const GENDER_TYPE = {
  MAN: "Man",
  WOMAN: "Woman",
  OTHERS: "Others",
} as const;

export const GENDER_TYPE_ARRAY = [
  GENDER_TYPE.MAN,
  GENDER_TYPE.WOMAN,
  GENDER_TYPE.OTHERS,
] as const;

export const ETHNICITY = {
  WHITE: "White",
  BLACK: "Black",
  ASIAN_AMERICAN: "Asian_American",
  EAST_ASIAN: "East_Asian",
  SOUTH_EAST_ASIAN: "South_East_Asian",
  SOUTH_ASIAN: "South_Asian",
  MIDDLE_EASTERN: "Middle_Eastern",
  PACIFIC: "Pacific",
  HISPANIC: "Hispanic",
} as const;

export const ETHNICITY_ARRAY = [
  ETHNICITY.WHITE,
  ETHNICITY.BLACK,
  ETHNICITY.ASIAN_AMERICAN,
  ETHNICITY.EAST_ASIAN,
  ETHNICITY.SOUTH_EAST_ASIAN,
  ETHNICITY.SOUTH_ASIAN,
  ETHNICITY.MIDDLE_EASTERN,
  ETHNICITY.PACIFIC,
  ETHNICITY.HISPANIC,
] as const;

export const EYE_COLOR = {
  BROWN: "Brown",
  BLUE: "Blue",
  HAZEL: "Hazel",
  GRAY: "Gray",
} as const;

export const EYE_COLOR_ARRAY = [
  EYE_COLOR.BROWN,
  EYE_COLOR.BLUE,
  EYE_COLOR.HAZEL,
  EYE_COLOR.GRAY,
] as const;

export const MODEL_STATUS = {
  PENDING: "Pending",
  GENERATED: "Generated",
  FAILED: "Failed",
} as const;

export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;
