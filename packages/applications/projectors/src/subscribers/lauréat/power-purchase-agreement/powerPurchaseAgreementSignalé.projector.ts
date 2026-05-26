import type { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const powerPurchaseAgreementSignaléProjector = async ({
  payload: { identifiantProjet, signaléLe, signaléPar },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementSignaléEvent) => {
  await upsertProjection<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEntity>(
    `power-purchase-agreement|${identifiantProjet}`,
    {
      signaléLe,
      signaléPar,
      identifiantProjet,
    },
  );
};
