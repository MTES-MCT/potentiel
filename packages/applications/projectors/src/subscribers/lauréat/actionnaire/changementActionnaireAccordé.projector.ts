import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

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

  if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
    getLogger().error(`Demande actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireAccordéProjector',
    });
    return;
  }

  const projectionToUpsert = await findProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Demande actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireAccordéProjector',
    });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...actionnaire,
    actionnaire: {
      nom: nouvelActionnaire,
      misÀJourLe: accordéLe,
    },
    dateDemandeEnCours: undefined,
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
    {
      ...projectionToUpsert,
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
