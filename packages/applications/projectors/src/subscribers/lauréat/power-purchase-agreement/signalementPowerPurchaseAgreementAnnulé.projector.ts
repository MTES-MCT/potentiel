import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const signalementPowerPurchaseAgreementAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.PowerPurchaseAgreement.SignalementPowerPurchaseAgreementAnnuléEvent) => {
  await removeProjection<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEntity>(
    `power-purchase-agreement|${identifiantProjet}`,
  );
};
