import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalDemandé = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    piècesJustificatives,
    demandéLe,
    demandéPar,
  },
}: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) =>
  upsertProjection<ReprésentantLégal.DemandeChangementReprésentantLégalEntity>(
    `demande-changement-représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.demandé.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal,
      piècesJustificatives,
      demandéLe,
      demandéPar,
    },
  );
