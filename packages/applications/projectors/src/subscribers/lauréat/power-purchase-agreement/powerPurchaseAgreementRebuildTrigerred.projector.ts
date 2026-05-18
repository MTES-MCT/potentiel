import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers/index.js';

export const powerPurchaseAgreementRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEntity>(
    `power-purchase-agreement`,
    id,
  );
};
