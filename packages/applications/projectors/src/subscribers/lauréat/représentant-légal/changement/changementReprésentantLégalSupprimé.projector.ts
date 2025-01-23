import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Where } from '@potentiel-domain/entity';

import { removeProjection } from '../../../../infrastructure';

export const changementReprésentantLégalSuppriméProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const derniersChangementsDemandés =
    await listProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal`,
      {
        where: {
          identifiantProjet: Where.equal(identifiantProjet),
          demande: {
            statut: Where.equal(
              ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
            ),
          },
        },
      },
    );

  if (derniersChangementsDemandés.total === 0) {
    getLogger().warn(`Aucune demande n'a été trouvée pour le changement de représentant supprimé`, {
      event,
    });
    return;
  }
  if (derniersChangementsDemandés.total > 1) {
    getLogger().warn(
      `Plusieurs demandes ont été trouvées pour le changement de représentant supprimé`,
      {
        event,
      },
    );
    return;
  }

  const changementReprésentantLégal = derniersChangementsDemandés.items[0];
  const identifiantChangement = `${identifiantProjet}#${changementReprésentantLégal.demande.demandéLe}`;

  await removeProjection(`changement-représentant-légal|${identifiantChangement}`);
};
