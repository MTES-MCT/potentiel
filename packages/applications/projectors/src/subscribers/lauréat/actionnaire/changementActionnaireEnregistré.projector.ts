import { Actionnaire } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';
import { getProjectData } from '../_utils/getProjectData';

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
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: enregistréLe,
    },
  });

  const projet = await getProjectData(identifiantProjet);

  if (!projet) {
    getLogger().error('Projet non trouvé', {
      identifiantProjet,
    });
    return;
  }

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
