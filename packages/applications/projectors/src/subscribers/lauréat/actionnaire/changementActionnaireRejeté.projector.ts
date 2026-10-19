import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementActionnaireRejetéProjector = async ({
  payload: {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
  },
}: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent) => {
  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      dernièreDemande: { statut: Lauréat.Actionnaire.StatutChangementActionnaire.rejeté.statut },
    },
  );

  await updateManyProjections<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    'changement-actionnaire',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.equal(Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut),
    },
    {
      miseÀJourLe: rejetéLe,
      statut: Lauréat.Actionnaire.StatutChangementActionnaire.rejeté.statut,
      demande: {
        rejet: {
          rejetéeLe: rejetéLe,
          rejetéePar: rejetéPar,
          réponseSignée: {
            format,
          },
        },
      },
    },
  );
};
