import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
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

  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      actionnaire: {
        nom: nouvelActionnaire,
        miseÀJourLe: accordéLe,
      },
      dateDemandeEnCours: undefined,
    },
  );

  await updateOneProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
    {
      miseÀJourLe: accordéLe,
      demande: {
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
