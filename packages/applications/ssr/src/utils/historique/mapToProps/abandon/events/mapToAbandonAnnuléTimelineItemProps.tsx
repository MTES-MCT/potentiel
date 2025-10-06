import { Lauréat } from '@potentiel-domain/projet';

import { HistoriqueItem } from '../../../HistoriqueItem.type';

export const mapToAbandonAnnuléTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.AbandonAnnuléEvent
> = ({ event }) => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: (
      <div>Demande d'abandon annulée par {<span className="font-semibold">{annuléPar}</span>}</div>
    ),
  };
};
