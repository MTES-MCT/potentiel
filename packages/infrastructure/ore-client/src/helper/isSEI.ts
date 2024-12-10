import { outreMerAndCorseCodePostal } from '../constant';

// le GRD EDF SEI gère les outre mer et la Corse, mais le référentiel ORE gère chaque outre mer individuellement
export const isSEI = (codePostal: string): boolean => {
  return (
    outreMerAndCorseCodePostal.includes(Number(codePostal.slice(0, 2))) ||
    outreMerAndCorseCodePostal.includes(Number(codePostal.slice(0, 3)))
  );
};
