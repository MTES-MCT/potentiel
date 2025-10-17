import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToProducteurModifiéTimelineItemsProps = (
  event: Lauréat.Producteur.ProducteurModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, producteur } = event.payload;

  return {
    date: modifiéLe,
    title: 'Producteur modifié',
    acteur: modifiéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau producteur : <span className="font-semibold">{producteur}</span>
        </div>
      </div>
    ),
  };
};
