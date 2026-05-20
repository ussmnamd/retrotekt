import { z } from 'zod';

export const contactSchema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters.').max(100),
  email:       z.string().email('Enter a valid email address.').max(255),
  company:     z.string().max(200).optional(),
  projectType: z.string().max(100).optional(),
  budget:      z.string().max(50).optional(),
  message:     z.string().min(10, 'Please include a bit more detail.').max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;
