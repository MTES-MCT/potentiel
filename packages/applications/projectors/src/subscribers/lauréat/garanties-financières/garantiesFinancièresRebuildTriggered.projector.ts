import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { clearProjection } from '../../../helpers/index.js';

export const garantiesFinancièresRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres`,
    id,
  );

  await removeProjectionWhere<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    { identifiantProjet: Where.equal(id) },
  );
};
