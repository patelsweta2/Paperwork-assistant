export const cosineSimilarity = (
  vectorA: number[],
  vectorB: number[],
): number => {
  const dotProduct = vectorA.reduce(
    (sum, value, index) => sum + value * vectorB[index],
    0,
  );
  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, value) => sum + value * value, 0),
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, value) => sum + value * value, 0),
  );

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};
