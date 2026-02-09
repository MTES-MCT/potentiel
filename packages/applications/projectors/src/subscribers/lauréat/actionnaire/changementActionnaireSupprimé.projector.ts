import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjectionWhere,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementActionnaireSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent) => {
  const actionnaire = await findProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(actionnaire)) {
    getLogger().error(`Aucun actionnaire n'a été trouvé`, {
      identifiantProjet,
    });
    return;
  }

  await upsertProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      identifiantProjet: actionnaire.identifiantProjet,
      actionnaire: actionnaire.actionnaire,
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
