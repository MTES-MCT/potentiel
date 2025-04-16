type DépasseRatiosChangementPuissanceProps = {
  minRatio: number;
  maxRatio: number;
  ratio: number;
};

export const dépasseRatiosChangementPuissance = ({
  minRatio,
  maxRatio,
  ratio,
}: DépasseRatiosChangementPuissanceProps) => ({
  enDeçaDeMin: ratio < minRatio,
  dépasseMax: ratio > maxRatio,
});
