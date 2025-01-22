import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';

export const changementActionnaireAccordéProjector = async ({
  payload: {
    nouvelActionnaire,
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Actionnaire.ChangementActionnaireAccordéEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  if (!projectionToUpsert.demandeEnCours) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  const demande = {
    ...projectionToUpsert.demandeEnCours,
    statut: Actionnaire.StatutChangementActionnaire.accordé.statut,

    accord: {
      accordéeLe: accordéLe,
      accordéePar: accordéPar,
      réponseSignée: {
        format,
      },
    },
  };

  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: nouvelActionnaire,
      misÀJourLe: accordéLe,
    },
    demandeEnCours: demande,
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${projectionToUpsert.demandeEnCours.demandéeLe}`,
    {
      identifiantProjet,
      projet: projectionToUpsert.projet,
      demande,
    },
  );
};
