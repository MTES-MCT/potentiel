import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementActionnaireAnnuléTimelineItemProps = (
  changementAnnulé: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = changementAnnulé.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de changement d'actionnaire annulée <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};
