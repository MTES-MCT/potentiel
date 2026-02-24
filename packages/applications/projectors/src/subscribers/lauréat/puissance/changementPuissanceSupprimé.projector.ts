import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjectionWhere,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementPuissanceSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Puissance.ChangementPuissanceSuppriméEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error('Puissance non trouvée', {
      identifiantProjet,
      fonction: 'changementPuissanceSuppriméProjector',
    });
    return;
  }

  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dernièreDemande: undefined,
  });

  await removeProjectionWhere<Lauréat.Puissance.ChangementPuissanceEntity>(`changement-puissance`, {
    identifiantProjet: Where.equal(identifiantProjet),
    demande: {
      statut: Where.equal(Lauréat.Puissance.StatutChangementPuissance.demandé.statut),
    },
  });
};
