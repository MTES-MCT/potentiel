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
  const actionnaire = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(actionnaire) || !actionnaire.demandeEnCours) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  const projectionToUpsert = await findProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.demandeEnCours.demandéeLe}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: nouvelActionnaire,
      misÀJourLe: accordéLe,
    },
    demandeEnCours: undefined,
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.demandeEnCours.demandéeLe}`,
    {
      identifiantProjet,
      projet: projectionToUpsert.projet,
      demande: {
        ...projectionToUpsert.demande,
        statut: Actionnaire.StatutChangementActionnaire.accordé.statut,

        accord: {
          accordéeLe: accordéLe,
          accordéePar: accordéPar,
          réponseSignée: {
            format,
          },
        },
      },
    },
  );
};
