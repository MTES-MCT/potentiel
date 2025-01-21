import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

import { removeProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalSupprimé = async (
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
          identifiantProjet: {
            operator: 'equal',
            value: identifiantProjet,
          },
          demande: {
            statut: {
              operator: 'equal',
              value: ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
            },
          },
        },
      },
    );

  if (derniersChangementsDemandés.total === 0) {
    getLogger().warn(`Aucune demande n'a été trouvée pour le changement de représentant accordé`, {
      event,
    });
    return;
  }
  if (derniersChangementsDemandés.total > 1) {
    getLogger().warn(
      `Plusieurs demandes ont été trouvées pour le changement de représentant accordé`,
      {
        event,
      },
    );
    return;
  }

  const { identifiantChangement } = derniersChangementsDemandés.items[0];

  await removeProjection(`changement-représentant-légal|${identifiantChangement}`);
};
