import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToLauréatCahierDesChargesChoisiTimelineItemProps = (
  modification: Lauréat.CahierDesChargesChoisiEvent,
) => {
  const { cahierDesCharges, modifiéLe, modifiéPar } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Cahier des charges modifié <TimelineItemUserEmail email={modifiéPar} />
      </div>
    ),
    content: (
      <div>
        Nouveau cahier des charges choisi :{' '}
        <span className="font-semibold">{cahierDesCharges}</span>
      </div>
    ),
  };
};
