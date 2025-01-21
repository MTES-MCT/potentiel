import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalAccordé = async (
  event: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) => {
  const {
    payload: {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      accordéLe,
      accordéPar,
    },
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

  const changementReprésentantLégal = derniersChangementsDemandés.items[0];

  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${changementReprésentantLégal.identifiantChangement}`,
    {
      ...changementReprésentantLégal,
      demande: {
        ...changementReprésentantLégal.demande,
        statut: ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
        accord: {
          nomReprésentantLégal,
          typeReprésentantLégal,
          accordéLe,
          accordéPar,
        },
      },
    },
  );

  await updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );
};
