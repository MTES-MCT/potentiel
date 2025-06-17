import { Lauréat } from '@potentiel-domain/projet';

import { MapToProducteurTimelineItemProps } from '../mapToProducteurTimelineItemProps';

export const mapToProducteurImportéTimelineItemProps: MapToProducteurTimelineItemProps = (
  record,
  icon,
) => {
  const { importéLe, producteur } =
    record.payload as Lauréat.Producteur.ProducteurImportéEvent['payload'];
  return {
    date: importéLe,
    icon,
    title: <div>Candidature : {<span className="font-semibold">{producteur}</span>}</div>,
  };
};
