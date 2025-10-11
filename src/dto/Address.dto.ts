import { z } from "zod";
import { createAddressSchema } from "../schema/address";
export type CreateAddressDto = z.infer<typeof createAddressSchema>;
