import { describe, it, expect } from 'vitest';

// Inline pure helpers from progress.js for testing (#61)
// (until we migrate to ES modules, we test the logic directly)

function buildBookSk(bookKey, label) {
  return `BOOK#${bookKey}#${label}`;
}

// ── Tests ────────────────────────────────────

describe('buildBookSk', () => {
  it('builds a correctly formatted SK', () => {
    expect(buildBookSk('cbg', 'Complete Blues Guitar Book 1 — Ch. 1–2'))
      .toBe('BOOK#cbg#Complete Blues Guitar Book 1 — Ch. 1–2');
  });

  it('works for all book keys', () => {
    expect(buildBookSk('blues1', 'Hendrix blues licks (p. 47)'))
      .toBe('BOOK#blues1#Hendrix blues licks (p. 47)');
    expect(buildBookSk('technique', 'Ultimate Guitar Technique Collection'))
      .toBe('BOOK#technique#Ultimate Guitar Technique Collection');
  });

  it('preserves special characters in label', () => {
    const label = 'Complete Blues Guitar Book 2 — Ch. 1 + Appendices A & B';
    expect(buildBookSk('cbg', label)).toBe(`BOOK#cbg#${label}`);
  });

  it('handles empty label gracefully', () => {
    expect(buildBookSk('cbg', '')).toBe('BOOK#cbg#');
  });
});
