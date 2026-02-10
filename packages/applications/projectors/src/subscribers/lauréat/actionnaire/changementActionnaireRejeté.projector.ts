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
      demande: {
        statut: Where.equal(Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut),
      },
    },
    {
      miseÀJourLe: rejetéLe,
      demande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.rejeté.statut,
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
