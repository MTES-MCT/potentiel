import { Recours } from '@potentiel-domain/elimine';
import { Historique } from '@potentiel-domain/historique';

export const mapToRecoursAnnuléTimelineItemProps = (
  recoursAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } = recoursAnnulé.payload as Recours.RecoursAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: <div>Recours annulé par {<span className="font-semibold">{annuléPar}</span>}</div>,
  };
};
