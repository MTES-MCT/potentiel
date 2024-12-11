import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalDemandé = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
  },
}: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  await upsertProjection<ReprésentantLégal.DemandeChangementReprésentantLégalEntity>(
    `demande-changement-représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.demandé.formatter(),
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      demandéLe,
      demandéPar,
    },
  );
};
