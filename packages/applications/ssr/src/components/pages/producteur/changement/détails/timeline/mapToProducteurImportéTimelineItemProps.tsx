import { Lauréat } from '@potentiel-domain/projet';

import { ProducteurHistoryRecord } from '.';

export const mapToProducteurImportéTimelineItemProps = (record: ProducteurHistoryRecord) => {
  const { importéLe, producteur } =
    record.payload as Lauréat.Producteur.ProducteurImportéEvent['payload'];
  return {
    date: importéLe,
    title: <div>Candidature : {<span className="font-semibold">{producteur}</span>}</div>,
  };
};
