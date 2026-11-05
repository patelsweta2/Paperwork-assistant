export const normalize = (s: string): string =>
  s.toLowerCase().replace(/[\s_\-.]+/g, "").trim();

export const levenshtein = (a: string, b: string): number => {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[b.length];
};

export const stringSimilarity = (a: string, b: string): number => {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  const maxLen = Math.max(x.length, y.length);
  return 1 - levenshtein(x, y) / maxLen;
};