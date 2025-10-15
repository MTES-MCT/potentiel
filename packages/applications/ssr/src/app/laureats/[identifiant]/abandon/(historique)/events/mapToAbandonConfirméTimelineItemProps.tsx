import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToAbandonConfirméTimelineItemProps = (
  abandonConfirmé: Lauréat.Abandon.AbandonConfirméEvent,
) => {
  const { confirméLe, confirméPar } = abandonConfirmé.payload;

  return {
    date: confirméLe,
    title: (
      <div>
        Demande d'abandon confirmée <TimelineItemUserEmail email={confirméPar} />
      </div>
    ),
  };
};
