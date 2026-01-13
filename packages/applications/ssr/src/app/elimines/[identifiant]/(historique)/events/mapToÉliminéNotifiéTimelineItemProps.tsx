import { Éliminé } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToÉliminéNotifiéTimelineItemProps = (
  event: Éliminé.ÉliminéNotifiéEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    notifiéLe,
    attestation: { format },
  } = event.payload;

  return {
    date: notifiéLe,
    title: 'Projet notifié éliminé',
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        'attestation',
        notifiéLe,
        format,
      ),
      label: "Télécharger l'avis de rejet",
      ariaLabel: `Télécharger l'avis de rejet de la candidature notifié le ${formatDateToText(notifiéLe)}`,
    },
  };
};
