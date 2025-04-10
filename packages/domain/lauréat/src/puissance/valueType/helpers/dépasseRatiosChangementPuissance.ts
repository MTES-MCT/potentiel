export const dépasseRatiosChangementPuissance = ({
  minRatio,
  maxRatio,
  ratio,
}: {
  minRatio: number;
  maxRatio: number;
  ratio: number;
}) => {
  return !(ratio >= minRatio && ratio <= maxRatio);
};
