import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalAccordé = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    accordéLe,
    accordéPar,
  },
}: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent) => {
  const changementReprésentantLégal =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjet}`,
    );

  if (Option.isSome(changementReprésentantLégal)) {
    await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjet}`,
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

    updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
      {
        nomReprésentantLégal,
        typeReprésentantLégal,
      },
    );
  }
};
