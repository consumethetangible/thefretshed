import { describe, it, expect } from 'vitest';

// Inline the pure logic from streak.js for testing
// (until we migrate to ES modules, we test the logic directly)

function calcStreaks(days) {
  if (!days || days.length === 0) return { current: 0, longest: 0, total: 0 };
  const sorted = [...new Set(days)].sort();
  let current = 0, longest = 0, streak = 1;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000;
    if (diff === 1) { streak++; }
    else { longest = Math.max(longest, streak); streak = 1; }
  }
  longest = Math.max(longest, streak);

  const lastDay = sorted[sorted.length - 1];
  current = (lastDay === today || lastDay === yesterday) ? streak : 0;

  return { current, longest, total: sorted.length };
}

// ── Tests ────────────────────────────────────

describe('calcStreaks', () => {
  it('returns zeros for empty input', () => {
    expect(calcStreaks([])).toEqual({ current: 0, longest: 0, total: 0 });
  });

  it('returns zeros for null input', () => {
    expect(calcStreaks(null)).toEqual({ current: 0, longest: 0, total: 0 });
  });

  it('counts total days correctly', () => {
    const days = ['2026-01-01', '2026-01-03', '2026-01-05'];
    expect(calcStreaks(days).total).toBe(3);
  });

  it('calculates longest streak correctly', () => {
    const days = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-10', '2026-01-11'];
    expect(calcStreaks(days).longest).toBe(3);
  });

  it('deduplicates repeated days', () => {
    const days = ['2026-01-01', '2026-01-01', '2026-01-02'];
    expect(calcStreaks(days).total).toBe(2);
  });

  it('handles a single day', () => {
    const days = ['2026-01-01'];
    expect(calcStreaks(days).longest).toBe(1);
    expect(calcStreaks(days).total).toBe(1);
  });
});
