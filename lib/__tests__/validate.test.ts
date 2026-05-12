import { describe, it, expect } from 'vitest';
import { validators, sanitize, hasErrors } from '@/lib/validate';

describe('validators.name', () => {
  it('rejects empty string', () => {
    expect(validators.name('')).toBeTruthy();
  });
  it('rejects single character', () => {
    expect(validators.name('A')).toBeTruthy();
  });
  it('accepts valid name', () => {
    expect(validators.name('John Smith')).toBeNull();
  });
  it('rejects name over 100 chars', () => {
    expect(validators.name('A'.repeat(101))).toBeTruthy();
  });
});

describe('validators.email', () => {
  it('rejects empty string', () => {
    expect(validators.email('')).toBeTruthy();
  });
  it('rejects address without @', () => {
    expect(validators.email('notanemail')).toBeTruthy();
  });
  it('rejects address without TLD', () => {
    expect(validators.email('user@domain')).toBeTruthy();
  });
  it('accepts valid email', () => {
    expect(validators.email('shahan@retrotekt.com')).toBeNull();
  });
  it('rejects email over 255 chars', () => {
    expect(validators.email(`${'a'.repeat(250)}@b.com`)).toBeTruthy();
  });
});

describe('validators.message', () => {
  it('rejects empty string', () => {
    expect(validators.message('')).toBeTruthy();
  });
  it('rejects message under 10 chars', () => {
    expect(validators.message('Hi')).toBeTruthy();
  });
  it('accepts valid message', () => {
    expect(validators.message('I need 3D renders for my project.')).toBeNull();
  });
  it('rejects message over 5000 chars', () => {
    expect(validators.message('A'.repeat(5001))).toBeTruthy();
  });
});

describe('sanitize', () => {
  it('strips HTML tags', () => {
    expect(sanitize('<script>alert(1)</script>')).toBe('alert(1)');
  });
  it('removes javascript: protocol', () => {
    expect(sanitize('javascript:alert(1)')).toBe('alert(1)');
  });
  it('removes data: protocol', () => {
    expect(sanitize('data:text/html,hello')).toBe('text/html,hello');
  });
  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });
  it('preserves clean text', () => {
    expect(sanitize('Hello, World!')).toBe('Hello, World!');
  });
});

describe('hasErrors', () => {
  it('returns true when any field has an error', () => {
    expect(hasErrors({ name: 'Required', email: null, message: null })).toBe(true);
  });
  it('returns false when all fields are null', () => {
    expect(hasErrors({ name: null, email: null, message: null })).toBe(false);
  });
});
