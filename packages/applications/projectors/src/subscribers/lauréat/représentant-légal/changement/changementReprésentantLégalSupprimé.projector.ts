import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjectionWhere,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementReprésentantLégalSuppriméProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const représentantLégal = await findProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal) || représentantLégal.dernièreDemande?.statut !== 'demandé') {
    getLogger().error(`Aucune demande en cours`, {
      identifiantProjet,
    });
    return;
  }

  await removeProjectionWhere<Lauréat.Puissance.ChangementPuissanceEntity>(`changement-puissance`, {
    identifiantProjet: Where.equal(identifiantProjet),
    demande: {
      statut: Where.equal(Lauréat.Puissance.StatutChangementPuissance.demandé.statut),
    },
  });

  await upsertProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
      typeReprésentantLégal: représentantLégal.typeReprésentantLégal,
    },
  );
};
