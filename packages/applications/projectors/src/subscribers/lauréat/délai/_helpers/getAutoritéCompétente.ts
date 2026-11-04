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
  return cahierDesCharges.getAutoritéCompétente({
    domain: 'délai',
    motif: Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(motif),
  });
};
