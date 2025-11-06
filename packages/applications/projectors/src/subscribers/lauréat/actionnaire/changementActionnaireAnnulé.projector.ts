import {
  removeProjectionWhere,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const changementActionnaireAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent) => {
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
