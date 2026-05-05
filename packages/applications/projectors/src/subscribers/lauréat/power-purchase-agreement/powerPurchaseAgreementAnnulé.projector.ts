import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const powerPurchaseAgreementAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementAnnuléEvent) => {
  await removeProjection<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEntity>(
    `power-purchase-agreement|${identifiantProjet}`,
  );
};
