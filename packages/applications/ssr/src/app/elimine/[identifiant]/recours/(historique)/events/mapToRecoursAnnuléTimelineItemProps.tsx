import { Éliminé } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToRecoursAnnuléTimelineItemProps = (
  recoursAnnulé: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    recoursAnnulé.payload as Éliminé.Recours.RecoursAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de recours annulée <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};
