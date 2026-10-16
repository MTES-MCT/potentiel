import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '../../utils/getCahierDesCharges.js';

export const getAutoritéCompétente = async (
  identifiantProjet: IdentifiantProjet.RawType,
  motif: Lauréat.Délai.MotifDemandeDélai.RawType,
): Promise<Lauréat.Délai.AutoritéCompétente.RawType> => {
  const cahierDesCharges = await getCahierDesCharges(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  if (!cahierDesCharges) {
    throw new Error(`Le cahier des charges du projet ${identifiantProjet} est introuvable.`);
  }
  return motif === 'prolongation-phase-essai'
    ? 'dgec'
    : (cahierDesCharges.getRèglesChangements('délai').autoritéCompétente ??
        Lauréat.Délai.AutoritéCompétente.DEFAULT_AUTORITE_COMPETENTE_DELAI);
};
