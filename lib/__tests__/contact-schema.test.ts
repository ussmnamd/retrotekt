import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/schemas/contact';

const valid = {
  name: 'John Smith',
  email: 'john@example.com',
  message: 'I need renders for my commercial project.',
};

describe('contactSchema', () => {
  it('accepts a minimal valid payload', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts a full payload with optional fields', () => {
    const full = {
      ...valid,
      company: 'Acme Corp',
      projectType: 'Still Renders — Starter (1–2 images)',
      budget: '$500 – $1,000',
    };
    expect(contactSchema.safeParse(full).success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects message under 10 chars', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects message over 5000 chars', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'A'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('rejects name over 100 chars', () => {
    const result = contactSchema.safeParse({ ...valid, name: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('strips optional fields when undefined', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBeUndefined();
      expect(result.data.projectType).toBeUndefined();
      expect(result.data.budget).toBeUndefined();
    }
  });
});
