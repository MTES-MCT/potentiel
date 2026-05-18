import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const signalementPowerPurchaseAgreementAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.PowerPurchaseAgreement.SignalementPowerPurchaseAgreementAnnuléEvent) => {
  await removeProjection<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEntity>(
    `power-purchase-agreement|${identifiantProjet}`,
  );
};
