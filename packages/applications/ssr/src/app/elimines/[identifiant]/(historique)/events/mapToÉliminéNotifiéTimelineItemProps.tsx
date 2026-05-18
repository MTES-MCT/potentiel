import { Candidature, Éliminé } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToÉliminéNotifiéTimelineItemProps = (
  event: Éliminé.ÉliminéNotifiéEvent,
): TimelineItemProps => {
  const { identifiantProjet, notifiéLe, attestation } = event.payload;

  return {
    date: notifiéLe,
    title: 'Projet notifié éliminé',
    file: {
      document: Candidature.DocumentCandidature.attestationDésignation({
        identifiantProjet,
        généréeLe: notifiéLe,
        attestation,
      }),
      label: "Télécharger l'avis de rejet",
      ariaLabel: `Télécharger l'avis de rejet de la candidature notifiée le ${formatDateToText(notifiéLe)}`,
    },
  };
};
