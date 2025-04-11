export const dépasseRatiosChangementPuissance = ({
  minRatio,
  maxRatio,
  ratio,
}: {
  minRatio: number;
  maxRatio: number;
  ratio: number;
}) => ({ enDeçaDeMin: ratio < minRatio, dépasseMax: ratio > maxRatio });
