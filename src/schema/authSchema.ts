import {z} from "zod";

export const LoginCredentialSchema = z.object({
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z.string().min(8, "at least should have 8").max(20, "20 is max"),
  });
  
export const RegisterCredentialSchema = z.object({
    name : z.string(),
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z.string().min(8, "at least should have 8").max(20, "20 is max"),
});