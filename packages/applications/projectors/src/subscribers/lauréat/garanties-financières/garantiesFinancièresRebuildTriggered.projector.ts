import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { clearProjection } from '../../../helpers';

export const garantiesFinancièresRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres`,
    id,
  );
  await clearProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres`,
    id,
  );
  await clearProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente`,
    id,
  );

  await clearProjection<Lauréat.GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
    `archives-garanties-financieres`,
    id,
  );

  await removeProjectionWhere<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    { identifiantProjet: Where.equal(id) },
  );
};
