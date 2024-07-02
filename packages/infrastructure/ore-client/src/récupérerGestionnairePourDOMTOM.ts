import { Option } from '@potentiel-libraries/monads';

import {
  RelevantDOMTOM,
  DOMTOMNameToGRDRaisonSociale,
  OreGestionnaire,
  MayotteGRDEIC,
} from './constant';
import { récupérerGRDParRaisonSociale } from './récupérerGRDParRaisonSociale';

export const récupérerGestionnairePourDOMTOM = async (
  DOMTOM: RelevantDOMTOM,
): Promise<Option.Type<OreGestionnaire>> => {
  // Mayotte is an edge case
  // because it's not listed in ORE
  if (DOMTOM === 'Mayotte') {
    return {
      grd: DOMTOMNameToGRDRaisonSociale[DOMTOM],
      eic: MayotteGRDEIC,
      contact: '',
    };
  }

  const raisonSociale = DOMTOMNameToGRDRaisonSociale[DOMTOM];

  const gestionnaire = await récupérerGRDParRaisonSociale(raisonSociale);
  return gestionnaire;
};
