import { calculateCarbonScore, calculateImprovementPercentage } from '@/utils/scoring';

describe('calculateCarbonScore', () => {
  it('should reduce score by 2 points per completed challenge', () => {
    expect(calculateCarbonScore(72, 3)).toBe(66);
  });

  it('should not return a negative score', () => {
    expect(calculateCarbonScore(10, 10)).toBe(0);
  });

  it('should handle zero completed challenges correctly', () => {
    expect(calculateCarbonScore(50, 0)).toBe(50);
  });

  it('should return 0 if base score is 0', () => {
    expect(calculateCarbonScore(0, 5)).toBe(0);
  });
});

describe('calculateImprovementPercentage', () => {
  it('should calculate the correct improvement percentage', () => {
    expect(calculateImprovementPercentage(100, 90)).toBe(10);
    expect(calculateImprovementPercentage(72, 66)).toBe(8); // 6/72 = 0.0833 -> 8%
  });

  it('should return 0 if there is no improvement', () => {
    expect(calculateImprovementPercentage(50, 50)).toBe(0);
  });

  it('should handle base score of 0 correctly', () => {
    expect(calculateImprovementPercentage(0, 0)).toBe(0);
  });
});
