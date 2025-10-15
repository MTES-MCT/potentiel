import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalAnnuléTimelineItemProps = (
  changementAnnulé: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = changementAnnulé.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de changement de représentant légal annulée{' '}
        <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};
