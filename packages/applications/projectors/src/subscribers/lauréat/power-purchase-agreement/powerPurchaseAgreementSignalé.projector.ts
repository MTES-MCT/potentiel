import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const powerPurchaseAgreementSignaléProjector = async ({
  payload: { identifiantProjet, signaléLe, signaléPar },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementSignaléEvent) => {
  await upsertProjection<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEntity>(
    `power-purchase-agreement|${identifiantProjet}`,
    {
      estPartiEnPPA: true,
      signaléLe,
      signaléPar,
      identifiantProjet,
    },
  );
};
