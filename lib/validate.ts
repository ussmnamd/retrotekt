export type FieldError = string | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validators = {
  name(v: string): FieldError {
    const s = v.trim();
    if (!s) return "Name is required.";
    if (s.length < 2) return "Name must be at least 2 characters.";
    if (s.length > 100) return "Name must be under 100 characters.";
    return null;
  },

  email(v: string): FieldError {
    const s = v.trim();
    if (!s) return "Email address is required.";
    if (!EMAIL_RE.test(s)) return "Enter a valid email address.";
    if (s.length > 255) return "Email address is too long.";
    return null;
  },

  message(v: string): FieldError {
    const s = v.trim();
    if (!s) return "Message is required.";
    if (s.length < 10) return "Please include a bit more detail (10 characters minimum).";
    if (s.length > 5000) return "Message must be under 5,000 characters.";
    return null;
  },
};

// Strip HTML tags and dangerous protocol prefixes before building mailto: URLs.
export function sanitize(v: string): string {
  return v
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .trim();
}

export function hasErrors(errors: Record<string, FieldError>): boolean {
  return Object.values(errors).some((e) => e !== null);
}
