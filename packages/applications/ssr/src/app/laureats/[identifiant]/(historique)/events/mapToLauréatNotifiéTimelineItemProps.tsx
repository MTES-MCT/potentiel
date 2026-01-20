import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToLauréatNotifiéTimelineItemProps = (
  event: Lauréat.LauréatNotifiéEvent | Lauréat.LauréatNotifiéV1Event,
  doitAfficherLienAttestationDésignation: boolean,
): TimelineItemProps => {
  const {
    identifiantProjet,
    notifiéLe,
    attestation: { format },
  } = event.payload;

  return {
    date: notifiéLe,
    title: 'Projet notifié lauréat',
    file: doitAfficherLienAttestationDésignation
      ? {
          document: DocumentProjet.convertirEnValueType(
            identifiantProjet,
            'attestation',
            notifiéLe,
            format,
          ),
          ariaLabel: `Télécharger l'attestation de désignation pour la candidature notifiée le ${formatDateToText(notifiéLe)}`,
        }
      : undefined,
  };
};
