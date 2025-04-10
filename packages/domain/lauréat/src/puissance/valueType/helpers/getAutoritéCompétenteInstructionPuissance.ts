import { RatioChangementPuissance } from '../..';

export const getAutoritéCompétenteInstructionPuissance = ({
  maxRatio,
  nouvellePuissance,
  puissanceInitiale,
}: {
  puissanceInitiale: number;
  maxRatio: number;
  nouvellePuissance: number;
}): RatioChangementPuissance.AutoritéCompétente => {
  const ratio = (nouvellePuissance * 1000000) / (puissanceInitiale * 1000000);

  return ratio > maxRatio ? 'dgec-admin' : 'dreal';
};
