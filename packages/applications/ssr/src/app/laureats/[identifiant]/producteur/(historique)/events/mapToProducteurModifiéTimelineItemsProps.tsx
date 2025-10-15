import { Lauréat } from '@potentiel-domain/projet';

export const mapToProducteurModifiéTimelineItemsProps = (
  record: Lauréat.Producteur.ProducteurModifiéEvent,
) => {
  const { modifiéLe, modifiéPar, producteur } = record.payload;

  return {
    date: modifiéLe,
    title: <div>Producteur modifié par {<span className="font-semibold">{modifiéPar}</span>}</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau producteur : <span className="font-semibold">{producteur}</span>
        </div>
      </div>
    ),
  };
};
