import { outreMerAndCorseCodePostal } from '../constant.js';

// le GRD EDF SEI gère les ZNI (zones interconnectés: outre-mer, Corse), mais le référentiel ORE gère chaque ZNI individuellement (EDF Réunion...)
export const isZNI = (codePostal: string): boolean => {
  return (
    outreMerAndCorseCodePostal.includes(Number(codePostal.slice(0, 2))) ||
    outreMerAndCorseCodePostal.includes(Number(codePostal.slice(0, 3)))
  );
};
