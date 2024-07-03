import { Option } from '@potentiel-libraries/monads';

import {
  RelevantOutreMer,
  outreMerNameToGRDRaisonSociale,
  OreGestionnaire,
  MayotteGRDEIC,
} from './constant';
import { récupérerGRDParRaisonSociale } from './récupérerGRDParRaisonSociale';

export const récupérerGestionnairePourOutreMer = async (
  outreMer: RelevantOutreMer,
): Promise<Option.Type<OreGestionnaire>> => {
  // Mayotte is an edge case
  // because it's not listed in ORE
  if (outreMer === 'Mayotte') {
    return {
      grd: outreMerNameToGRDRaisonSociale[outreMer],
      eic: MayotteGRDEIC,
      contact: '',
    };
  }

  const raisonSociale = outreMerNameToGRDRaisonSociale[outreMer];

  const gestionnaire = await récupérerGRDParRaisonSociale(raisonSociale);
  return gestionnaire;
};
