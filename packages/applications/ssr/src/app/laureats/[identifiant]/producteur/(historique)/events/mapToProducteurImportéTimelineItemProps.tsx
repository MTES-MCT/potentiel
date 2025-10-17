import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToProducteurImportéTimelineItemProps = (
  event: Lauréat.Producteur.ProducteurImportéEvent,
): TimelineItemProps => {
  const { importéLe, producteur } = event.payload;
  return {
    date: importéLe,
    title: <>Candidature : {<span className="font-semibold">{producteur}</span>}</>,
  };
};
