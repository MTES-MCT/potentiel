import { Lauréat } from '@potentiel-domain/projet';

export const mapToProducteurImportéTimelineItemProps = (
  record: Lauréat.Producteur.HistoriqueProducteurProjetListItemReadModel,
) => {
  const { importéLe, producteur } =
    record.payload as Lauréat.Producteur.ProducteurImportéEvent['payload'];
  return {
    date: importéLe,
    title: <div>Candidature : {<span className="font-semibold">{producteur}</span>}</div>,
  };
};
