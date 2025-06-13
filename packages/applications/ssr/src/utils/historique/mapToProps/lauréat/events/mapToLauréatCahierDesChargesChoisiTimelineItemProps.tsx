import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToLauréatCahierDesChargesChoisiTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { cahierDesCharges, modifiéLe, modifiéPar } =
    modification.payload as Lauréat.CahierDesChargesChoisiEvent['payload'];

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
