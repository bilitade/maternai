import { describe, expect, it } from 'vitest';
import { getANCAlertLevel, getHighestANCAlert } from '@/lib/ancLogic';
import { calculateRisk, calcGestationalWeeks } from '@/lib/riskLogic';
import { classifyAnemia, dietaryDiversityStatus, muacStatus } from '@/lib/nutritionLogic';
import { getFallbackResponse } from '@/lib/aiFallbacks';

describe('ancLogic', () => {
  it('flags red alert when 21+ days overdue', () => {
    const lmp = new Date();
    lmp.setDate(lmp.getDate() - 7 * 12 - 25);
    const { level } = getANCAlertLevel(lmp.toISOString().slice(0, 10), 12, false);
    expect(level).toBe('red');
  });

  it('returns none when contact completed', () => {
    const { level } = getANCAlertLevel('2025-01-01', 12, true);
    expect(level).toBe('none');
  });

  it('picks highest overdue contact', () => {
    const lmp = new Date();
    lmp.setDate(lmp.getDate() - 7 * 22);
    const result = getHighestANCAlert(lmp.toISOString().slice(0, 10), []);
    expect(result.contactId).toBeTruthy();
  });
});

describe('riskLogic', () => {
  it('marks high risk for age + hypertension', () => {
    const result = calculateRisk({
      age: 38,
      hypertension: true,
      diabetes: false,
      previousCSection: false,
      previousStillbirth: false,
      multiplePregnancy: false,
      hiv: false,
      anemia: false,
      tb: false,
      gravidity: 2,
      familySupport: 'yes',
    } as Parameters<typeof calculateRisk>[0]);
    expect(result.riskLevel).toBe('high');
  });

  it('computes gestational weeks from LMP', () => {
    const lmp = new Date();
    lmp.setDate(lmp.getDate() - 7 * 20);
    const weeks = calcGestationalWeeks(lmp.toISOString().slice(0, 10));
    expect(weeks).toBeGreaterThanOrEqual(19);
    expect(weeks).toBeLessThanOrEqual(21);
  });
});

describe('nutritionLogic', () => {
  it('classifies anemia thresholds', () => {
    expect(classifyAnemia(11)).toBe('normal');
    expect(classifyAnemia(9.5)).toBe('mild');
    expect(classifyAnemia(6)).toBe('severe');
  });

  it('flags MUAC below 23', () => {
    expect(muacStatus(22)).toBe('malnutrition');
    expect(muacStatus(24)).toBe('normal');
  });

  it('scores dietary diversity at 5+', () => {
    expect(dietaryDiversityStatus(5)).toBe('adequate');
    expect(dietaryDiversityStatus(3)).toBe('poor');
  });
});

describe('aiFallbacks', () => {
  it('urgent guidance for bleeding', () => {
    const text = getFallbackResponse({
      action: 'dangerSigns',
      payload: { signs: ['Vaginal bleeding'], weeks: 28 },
    });
    expect(text.toLowerCase()).toContain('urgent');
  });

  it('returns nutrition tip for trimester', () => {
    const text = getFallbackResponse({
      action: 'nutrition',
      payload: { weeks: 10 },
    });
    expect(text.length).toBeGreaterThan(20);
  });
});
