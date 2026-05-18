import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToSignalementPowerPurchaseAgreementAnnuléTimelineItemProps = (
  event: Lauréat.PowerPurchaseAgreement.SignalementPowerPurchaseAgreementAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Signalement PPA annulé',
    actor: annuléPar,

    details: (
      <div className="flex flex-col gap-2">
        Le signalement du projet comme étant signataire d'un contrat de vente de gré à gré (PPA) a
        été annulé.
      </div>
    ),
  };
};
