import { Lauréat } from '@potentiel-domain/projet';

export const mapToDélaiAccordéTimelineItemProps = (
  abandonAccordé: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel,
) => {
  const { accordéLe, durée, raison } =
    abandonAccordé.payload as Lauréat.Délai.DélaiAccordéEvent['payload'];

  return {
    date: accordéLe,
    title: <div>Délai accordé</div>,
    content: (
      <>
        <div>Durée : {durée} mois</div>
        <div>Raison : {raison}</div>
      </>
    ),
  };
};
