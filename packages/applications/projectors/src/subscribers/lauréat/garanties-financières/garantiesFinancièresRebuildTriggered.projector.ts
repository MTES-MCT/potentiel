import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { rebuildProjection } from '../../../helpers';

export const garantiesFinancièresRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await rebuildProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres`,
    id,
  );
  await rebuildProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres`,
    id,
  );
  await rebuildProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente`,
    id,
  );

  await rebuildProjection<Lauréat.GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
    `archives-garanties-financieres`,
    id,
  );

  await removeProjectionWhere<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    { identifiantProjet: Where.equal(id) },
  );
};
