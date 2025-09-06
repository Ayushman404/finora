import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["CURRENT", "SAVINGS"], {
    errorMap: () => ({ message: "Please select a valid account type" }),
  }),
  balance: z.string().min(1, "Balance is required"),
  isDefault: z.boolean().default(false),
});
