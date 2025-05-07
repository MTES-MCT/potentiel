import { Producteur } from '@potentiel-domain/laureat';

import { ProducteurHistoryRecord } from '.';

export const mapToProducteurImportéTimelineItemsProps = (record: ProducteurHistoryRecord) => {
  const { importéLe, producteur } = record.payload as Producteur.ProducteurImportéEvent['payload'];

  return {
    date: importéLe,
    title: <div>Candidature : {<span className="font-semibold">{producteur}</span>}</div>,
  };
};
