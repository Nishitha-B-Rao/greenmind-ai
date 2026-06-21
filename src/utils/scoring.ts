/**
 * Calculates the dynamic carbon score based on completed challenges.
 * Each completed challenge reduces the score by 2 points (representing carbon savings).
 * 
 * @param baseScore The baseline score from the initial assessment
 * @param completedChallenges The number of challenges the user has completed
 * @returns The current dynamically calculated score
 */
export function calculateCarbonScore(baseScore: number, completedChallenges: number): number {
  if (baseScore <= 0) return 0;
  if (completedChallenges < 0) return baseScore;
  
  // Each completed challenge drops the score by 2 points
  const reduction = completedChallenges * 2;
  const currentScore = Math.max(0, baseScore - reduction);
  
  return currentScore;
}

/**
 * Calculates the percentage improvement from the baseline score.
 */
export function calculateImprovementPercentage(baseScore: number, currentScore: number): number {
  if (baseScore <= 0) return 0;
  if (currentScore >= baseScore) return 0;
  
  const diff = baseScore - currentScore;
  const percentage = (diff / baseScore) * 100;
  
  return Math.round(percentage);
}
