import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementActionnaireRejetéTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent,
): TimelineItemProps => {
  const {
    rejetéLe,
    rejetéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  return {
    date: rejetéLe,
    title: "Demande de changement d'actionnaire rejetée",
    actor: rejetéPar,
    file: {
      document: Lauréat.Actionnaire.DocumentActionnaire.changementRejeté({
        identifiantProjet,
        rejetéLe,
        réponseSignée: {
          format,
        },
      }),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de changement d'actionnaire rejetée le ${formatDateToText(rejetéLe)}`,
    },
  };
};
