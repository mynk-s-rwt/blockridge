import { describe, it, expect } from 'vitest';
import { truncateDecimals } from './number';

describe('truncateDecimals', () => {
  it('should truncate to the specified number of decimal places without rounding', () => {
    expect(truncateDecimals('123.456789', 2)).toBe('123.45');
    expect(truncateDecimals('123.9999', 2)).toBe('123.99');
    expect(truncateDecimals('0.123456789', 8)).toBe('0.12345678');
    expect(truncateDecimals('100', 2)).toBe('100');
    expect(truncateDecimals('123.4', 2)).toBe('123.4');
    expect(truncateDecimals('', 2)).toBe('');
    expect(truncateDecimals('123.', 2)).toBe('123.');
  });

  it('should handle zero maxDecimals correctly', () => {
    expect(truncateDecimals('123.456', 0)).toBe('123.');
    expect(truncateDecimals('123', 0)).toBe('123');
  });

  it('should handle negative numbers', () => {
    expect(truncateDecimals('-123.456789', 2)).toBe('-123.45');
  });

  it('should handle invalid input gracefully', () => {
    // truncateDecimals expects a string as input and handles numbers with a decimal.
    // Non-numeric strings or other types would typically be handled by input validation
    // before reaching this function, but for robustness, we can add a basic check.
    expect(truncateDecimals('abc', 2)).toBe('abc');
    expect(truncateDecimals('123.a', 2)).toBe('123.a');
  });
}); 