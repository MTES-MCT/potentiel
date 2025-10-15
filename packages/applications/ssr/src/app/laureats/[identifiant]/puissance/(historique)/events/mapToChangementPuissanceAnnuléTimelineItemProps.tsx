import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementPuissanceAnnuléTimelineItemProps = (
  record: Lauréat.Puissance.ChangementPuissanceAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = record.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de changement de puissance annulée <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};
