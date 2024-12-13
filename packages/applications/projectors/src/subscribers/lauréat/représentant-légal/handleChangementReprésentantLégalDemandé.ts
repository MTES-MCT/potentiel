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
  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
      demande: {
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe,
        demandéPar,
      },
    },
  );
};
