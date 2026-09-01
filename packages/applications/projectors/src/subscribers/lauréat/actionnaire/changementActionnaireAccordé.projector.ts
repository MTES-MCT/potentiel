import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

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

  if (Option.isNone(actionnaire)) {
    throw new Error(`Actionnaire non trouvé pour le projet ${identifiantProjet}`);
  }

  const demande = await findProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dernièreDemande?.date}`,
  );

  if (Option.isNone(demande)) {
    throw new Error(
      `Demande de changement d'actionnaire non trouvée pour le projet ${identifiantProjet}`,
    );
  }

  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      actionnaire: {
        nom: nouvelActionnaire,
        miseÀJourLe: accordéLe,
        attestation: {
          format: demande.demande.pièceJustificative?.format,
          date: demande.demande.demandéeLe,
        },
      },
      dernièreDemande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.accordé.statut,
      },
    },
  );

  await updateOneProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${demande.demande.demandéeLe}`,
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
