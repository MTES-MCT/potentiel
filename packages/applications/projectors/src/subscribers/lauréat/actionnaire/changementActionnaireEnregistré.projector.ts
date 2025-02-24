import { Actionnaire } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';
import { getProjectDataFromCandidature } from '../_utils/getProjectData';

export const changementActionnaireEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    actionnaire,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Actionnaire.ChangementActionnaireEnregistréEvent) => {
  const projet = await getProjectDataFromCandidature(identifiantProjet);

  if (!projet) {
    getLogger().error('Projet non trouvé', {
      identifiantProjet,
    });
    return;
  }

  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: enregistréLe,
    },
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      projet,
      demande: {
        nouvelActionnaire: actionnaire,
        statut: Actionnaire.StatutChangementActionnaire.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
