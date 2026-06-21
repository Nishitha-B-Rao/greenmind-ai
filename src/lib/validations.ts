import { z } from 'zod';

// Shared API validation schemas

export const AssessmentSchema = z.object({
  diet: z.string().min(1, "Diet is required"),
  transport: z.string().min(1, "Transport is required"),
  electricity: z.string().min(1, "Electricity is required"),
  shopping: z.string().min(1, "Shopping is required"),
  household: z.string().min(1, "Household is required")
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  }))
});

export const ReceiptUploadSchema = z.object({
  imageBase64: z.string().min(10, "Invalid image data"),
  mimeType: z.string().regex(/^image\/(jpeg|png)$/, "Only JPG or PNG allowed")
});
