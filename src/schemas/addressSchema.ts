import z from "zod";

export const addressSchema = z.object({
  id: z.number(),
  neighborhood: z.string(),
  groupId: z.number(),
  householder: z.string(),
  birth: z.number(),
  gender: z.union([z.literal("남"), z.literal("여")]),
  address: z.string(),
  phoneNumber: z.string(),
  note: z.string(),
  needFan: z.string(),
  createdAt: z.string(),
  visitDay: z.union([z.literal(1), z.literal(2)]),
  lat: z.number(),
  lng: z.number(),
});

export const addressListSchema = z.array(addressSchema);

export type AddressPoint = z.infer<typeof addressSchema>;
