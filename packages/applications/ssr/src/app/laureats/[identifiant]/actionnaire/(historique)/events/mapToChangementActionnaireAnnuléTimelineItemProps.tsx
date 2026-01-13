import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementActionnaireAnnuléTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: "Demande de changement d'actionnaire annulée",
    actor: annuléPar,
  };
};
