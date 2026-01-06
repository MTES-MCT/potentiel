import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementActionnaireAccordéProjector = async ({
  payload: {
    nouvelActionnaire,
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Lauréat.Actionnaire.ChangementActionnaireAccordéEvent) => {
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

  await updateManyProjections<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    'changement-actionnaire',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut),
      },
    },
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
