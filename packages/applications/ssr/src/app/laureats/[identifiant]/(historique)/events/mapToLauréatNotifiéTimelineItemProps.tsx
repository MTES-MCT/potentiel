import { Candidature, type Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToLauréatNotifiéTimelineItemProps = (
  event: Lauréat.LauréatNotifiéEvent | Lauréat.LauréatNotifiéV1Event,
  doitAfficherLienAttestationDésignation: boolean,
): TimelineItemProps => {
  const { identifiantProjet, notifiéLe, attestation } = event.payload;

  return {
    date: notifiéLe,
    title: 'Projet notifié lauréat',
    file: doitAfficherLienAttestationDésignation
      ? {
          document: Candidature.DocumentCandidature.attestationDésignation({
            identifiantProjet,
            généréeLe: notifiéLe,
            attestation,
          }),
          ariaLabel: `Télécharger l'attestation de désignation pour la candidature notifiée le ${formatDateToText(notifiéLe)}`,
        }
      : undefined,
  };
};
