import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { removeProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalAnnulé = async (
  event: ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const changementReprésentantLégal =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjet}`,
    );

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().warn(
      `Aucune demande n'a été trouvée pour l'annulation de la demande de changement de représentant légal`,
      {
        event,
      },
    );
    return;
  }

  await removeProjection(`changement-représentant-légal|${identifiantProjet}`);
};
