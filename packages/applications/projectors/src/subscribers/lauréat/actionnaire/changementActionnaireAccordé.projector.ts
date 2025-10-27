import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementActionnaireAccordéProjector = async ({
  payload: {
    nouvelActionnaire,
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Lauréat.Actionnaire.ChangementActionnaireAccordéEvent) => {
  const actionnaire = await findProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
    getLogger().error(`Demande actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireAccordéProjector',
    });
    return;
  }

  const projectionToUpsert = await findProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Demande actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireAccordéProjector',
    });
    return;
  }

  await upsertProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      ...actionnaire,
      actionnaire: {
        nom: nouvelActionnaire,
        misÀJourLe: accordéLe,
      },
      dateDemandeEnCours: undefined,
    },
  );

  await upsertProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
    {
      ...projectionToUpsert,
      miseÀJourLe: accordéLe,
      demande: {
        ...projectionToUpsert.demande,
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.accordé.statut,

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
