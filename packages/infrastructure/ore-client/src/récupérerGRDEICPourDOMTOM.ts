import { RelevantDOMTOM, DOMTOMNameToGRDEIC, OreGestionnaire } from './constant';
import { récupérerGRDParEIC } from './récupérerGRDParEIC';

export const récupérerGRDEICPourDOMTOM = async (
  DOMTOM: RelevantDOMTOM,
): Promise<OreGestionnaire> => {
  const codeEIC = DOMTOMNameToGRDEIC[DOMTOM];
  const gestionnaire = await récupérerGRDParEIC(codeEIC);
  return gestionnaire;
};
