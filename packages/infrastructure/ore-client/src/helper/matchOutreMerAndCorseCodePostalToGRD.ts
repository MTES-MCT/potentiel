import { Option } from '@potentiel-libraries/monads';

import { outreMerAndCorseCodePostalToGRD } from '../constant';
import { OreGestionnaireByCity } from '../récupérerGRDParVille';

export const matchOutreMerAndCorseCodePostalToGRD = (
  codePostal: string,
): Option.Type<OreGestionnaireByCity> => {
  return (
    outreMerAndCorseCodePostalToGRD[codePostal.slice(0, 2)] ??
    outreMerAndCorseCodePostalToGRD[codePostal.slice(0, 3)] ??
    Option.none
  );
};
