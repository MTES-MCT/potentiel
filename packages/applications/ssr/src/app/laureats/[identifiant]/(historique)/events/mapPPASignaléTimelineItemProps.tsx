import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPPASignaléTimelineItemProps = (
  event: Lauréat.PPASignaléEvent,
): TimelineItemProps => {
  const { signaléLe, signaléPar } = event.payload;

  return {
    date: signaléLe,
    title: 'PPA signalé',
    actor: signaléPar,

    details: (
      <div className="flex flex-col gap-2">
        Le projet a été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA).
      </div>
    ),
  };
};
