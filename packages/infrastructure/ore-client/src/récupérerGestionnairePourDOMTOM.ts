import { Option } from '@potentiel-libraries/monads';

import { RelevantDOMTOM, DOMTOMNameToGRDRaisonSociale, OreGestionnaire } from './constant';
import { récupérerGRDParRaisonSociale } from './récupérerGRDParRaisonSociale';

export const récupérerGestionnairePourDOMTOM = async (
  DOMTOM: RelevantDOMTOM,
): Promise<Option.Type<OreGestionnaire>> => {
  const raisonSociale = DOMTOMNameToGRDRaisonSociale[DOMTOM];
  const gestionnaire = await récupérerGRDParRaisonSociale(raisonSociale);
  return gestionnaire;
};
