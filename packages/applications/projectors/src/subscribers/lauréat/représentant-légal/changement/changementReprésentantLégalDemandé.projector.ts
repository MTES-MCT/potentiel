import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection, upsertProjection } from '../../../../infrastructure';
import { getProjectDataFromCandidature } from '../../_utils/getProjectData';

export const changementReprésentantLégalDemandéProjector = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
  },
}: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  const projet = await getProjectDataFromCandidature(identifiantProjet);

  if (!projet) {
    getLogger().error('Projet non trouvé', {
      identifiantProjet,
    });
    return;
  }

  const identifiantChangement = `${identifiantProjet}#${demandéLe}`;

  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantChangement}`,
    {
      identifiantProjet,
      projet,
      demande: {
        statut: ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe,
        demandéPar,
      },
    },
  );

  await updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      demandeEnCours: { demandéLe },
    },
  );
};
