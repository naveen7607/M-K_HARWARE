import { z } from "zod";

const mobileSchema = z.string().min(10).max(16);
const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(120),
    mobile: mobileSchema,
    email: z.string().email(),
    password: passwordSchema
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: passwordSchema
  })
});

export const googleLoginSchema = z.object({
  body: z.object({
    credential: z.string().min(10),
    mobile: mobileSchema.optional()
  })
});

export const requestOtpSchema = z.object({
  body: z.object({
    mobile: mobileSchema
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    mobile: mobileSchema,
    code: z.string().regex(/^\d{6}$/)
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(24),
    password: passwordSchema
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(120).optional(),
    mobile: mobileSchema.optional(),
    email: z.string().email().optional()
  })
});
