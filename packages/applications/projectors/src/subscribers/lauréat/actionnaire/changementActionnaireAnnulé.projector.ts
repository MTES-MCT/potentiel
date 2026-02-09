import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const changementActionnaireAnnuléProjector = async ({
  payload: { identifiantProjet, annuléLe },
}: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent) => {
  await updateManyProjections<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut),
      },
    },
    {
      miseÀJourLe: annuléLe,
      demande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.annulé.statut,
      },
    },
  );

  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      demande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.annulé.statut,
      },
    },
  );
};
