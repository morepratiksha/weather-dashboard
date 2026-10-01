import { describe, expect, it } from 'vitest'
import { toUnit, weatherLabel, weekday } from './utils'

describe('utils', () => {
  it('converts Celsius to Fahrenheit and rounds', () => {
    expect(toUnit(0, 'F')).toBe(32)
    expect(toUnit(100, 'F')).toBe(212)
    expect(toUnit(21.6, 'C')).toBe(22)
  })
  it('maps weather codes to labels', () => {
    expect(weatherLabel(0)).toBe('Clear sky')
    expect(weatherLabel(95)).toBe('Thunderstorm')
    expect(weatherLabel(12345)).toBe('Unknown')
  })
  it('formats weekday from an ISO date', () => {
    expect(weekday('2026-09-30')).toBe('Wed')
  })
})
