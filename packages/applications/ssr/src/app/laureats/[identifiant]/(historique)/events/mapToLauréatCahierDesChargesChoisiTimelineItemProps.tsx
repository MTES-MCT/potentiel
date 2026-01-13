import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToLauréatCahierDesChargesChoisiTimelineItemProps = (
  event: Lauréat.CahierDesChargesChoisiEvent,
): TimelineItemProps => {
  const { cahierDesCharges, modifiéLe, modifiéPar } = event.payload;

  return {
    date: modifiéLe,
    title: 'Cahier des charges modifié',
    actor: modifiéPar,
    details: (
      <div>
        Nouveau cahier des charges choisi :{' '}
        <span className="font-semibold">{cahierDesCharges}</span>
      </div>
    ),
  };
};
