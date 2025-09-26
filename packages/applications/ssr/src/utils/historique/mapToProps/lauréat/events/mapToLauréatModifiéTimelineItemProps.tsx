import { Lauréat } from '@potentiel-domain/projet';

export const mapToLauréatCahierDesChargesChoisiTimelineItemProps = (
  modification: Lauréat.CahierDesChargesChoisiEvent,
) => {
  const { cahierDesCharges, modifiéLe, modifiéPar } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Cahier des charges modifié par {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <div>
        Nouveau cahier des charges choisi :{' '}
        <span className="font-semibold">{cahierDesCharges}</span>
      </div>
    ),
  };
};
