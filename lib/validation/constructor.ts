import { z } from "zod";

import {
  AUDIENCE_OPTIONS,
  INDUSTRY_OPTIONS,
  BRAND_COLOR_OPTIONS,
  PSYCHOLOGY_OPTIONS,
  DEADLINE_OPTIONS,
  FORMAT_OPTIONS,
  PRIORITY_OPTIONS
} from "@/types/constructor";

const audienceEnum = z.enum(
  AUDIENCE_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof AUDIENCE_OPTIONS)[number]["id"],
    ...(typeof AUDIENCE_OPTIONS)[number]["id"][]
  ]
);

const industryEnum = z.enum(
  INDUSTRY_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof INDUSTRY_OPTIONS)[number]["id"],
    ...(typeof INDUSTRY_OPTIONS)[number]["id"][]
  ]
);

const brandColorEnum = z.enum(
  BRAND_COLOR_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof BRAND_COLOR_OPTIONS)[number]["id"],
    ...(typeof BRAND_COLOR_OPTIONS)[number]["id"][]
  ]
);

const psychologyEnum = z.enum(
  PSYCHOLOGY_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof PSYCHOLOGY_OPTIONS)[number]["id"],
    ...(typeof PSYCHOLOGY_OPTIONS)[number]["id"][]
  ]
);

const deadlineEnum = z.enum(
  DEADLINE_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof DEADLINE_OPTIONS)[number]["id"],
    ...(typeof DEADLINE_OPTIONS)[number]["id"][]
  ]
);

const formatEnum = z.enum(
  FORMAT_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof FORMAT_OPTIONS)[number]["id"],
    ...(typeof FORMAT_OPTIONS)[number]["id"][]
  ]
);

const priorityEnum = z.enum(
  PRIORITY_OPTIONS.map(
    (item) => item.id
  ) as [
    (typeof PRIORITY_OPTIONS)[number]["id"],
    ...(typeof PRIORITY_OPTIONS)[number]["id"][]
  ]
);

export const constructorSchema = z.object({
  audience: z
    .array(audienceEnum)
    .min(1, "Выберите хотя бы одну аудиторию"),

  quantity: z
    .number()
    .int()
    .min(1, "Минимальное количество — 1"),

  budgetPerPerson: z
    .number()
    .int()
    .min(5000, "Минимальный бюджет — 5 000 ₸")
    .max(1000000),

  industry: industryEnum,

  brandColor: brandColorEnum,

  psychology: z
    .array(psychologyEnum)
    .min(1, "Выберите хотя бы одно предпочтение")
    .max(4),

  deadline: deadlineEnum,

  format: formatEnum,

  priority: priorityEnum
});