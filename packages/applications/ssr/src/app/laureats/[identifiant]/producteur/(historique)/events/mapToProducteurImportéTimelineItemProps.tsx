import { Lauréat } from '@potentiel-domain/projet';

export const mapToProducteurImportéTimelineItemProps = (
  record: Lauréat.Producteur.ProducteurImportéEvent,
) => {
  const { importéLe, producteur } = record.payload;
  return {
    date: importéLe,
    title: <div>Candidature : {<span className="font-semibold">{producteur}</span>}</div>,
  };
};
