import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  removeProjectionWhere,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementActionnaireSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent) => {
  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      dateDemandeEnCours: undefined,
    },
  );

  await removeProjectionWhere<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut),
      },
    },
  );
};
