import z from "zod";

export const registerSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim(),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Invalid email format" })),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
  role: z.enum(["CUSTOMER", "AGENT", "MANAGER"]).default("CUSTOMER"),
});
