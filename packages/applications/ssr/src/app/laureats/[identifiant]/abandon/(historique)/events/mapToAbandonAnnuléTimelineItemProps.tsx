import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToAbandonAnnuléTimelineItemProps = (
  abandonAnnulé: Lauréat.Abandon.AbandonAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = abandonAnnulé.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Demande d'abandon annulée <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};
