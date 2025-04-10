export type ExceedsRatiosChangementPuissance = (arg: {
  minRatio: number;
  maxRatio: number;
  nouvellePuissance: number;
  puissanceInitiale: number;
}) => boolean;

export const exceedsRatiosChangementPuissance: ExceedsRatiosChangementPuissance = ({
  minRatio,
  maxRatio,
  nouvellePuissance,
  puissanceInitiale,
}) => {
  const ratio = (nouvellePuissance * 1000000) / (puissanceInitiale * 1000000);

  return !(ratio >= minRatio && ratio <= maxRatio);
};
