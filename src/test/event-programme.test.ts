import { describe, expect, it } from 'vitest';
import { decemberEvent, programme, sessionsOverlap } from '@/lib/event-programme';

describe('December opening event', () => {
  it('uses the requested 5 December 2026 date', () => {
    expect(decemberEvent.date).toBe('2026-12-05');
  });
  it('keeps every activity within the 10 am–5 pm CAT event', () => {
    expect(decemberEvent.start).toBe('10:00');
    expect(decemberEvent.end).toBe('17:00');
    expect(decemberEvent.timezone).toBe('Africa/Harare');
    expect(programme.every(s => s.start >= '10:00' && s.end <= '17:00' && s.end > s.start)).toBe(true);
  });
  it('provides sessions for each of the five requested zones', () => {
    expect([...new Set(programme.map(s => s.zone))].sort()).toEqual(['adventure', 'baby', 'creative', 'discovery', 'stage']);
  });
  it('does not treat an unapproved programme as confirmed', () => {
    expect(decemberEvent.status).toBe('proposed');
  });
  it('detects simultaneous activities but allows back-to-back sessions', () => {
    const a = { id: 'a', zone: 'baby', start: '10:30', end: '11:00', title: 'A' };
    expect(sessionsOverlap(a, { ...a, id: 'b', start: '10:45', end: '11:15' })).toBe(true);
    expect(sessionsOverlap(a, { ...a, id: 'c', start: '11:00', end: '11:30' })).toBe(false);
  });
});