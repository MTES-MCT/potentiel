import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPowerPurchaseAgreementAnnuléTimelineItemProps = (
  event: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'PPA Annulé',
    actor: annuléPar,

    details: (
      <div className="flex flex-col gap-2">
        Le projet a été déclaré comme n'étant plus ou pas signataire d'un contrat de vente de gré à
        gré (PPA).
      </div>
    ),
  };
};
