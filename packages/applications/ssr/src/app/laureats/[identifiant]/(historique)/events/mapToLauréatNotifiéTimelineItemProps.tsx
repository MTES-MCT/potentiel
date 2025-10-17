import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

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
    content: doitAfficherLienAttestationDésignation ? (
      <DownloadDocument
        className="mb-0"
        label="Télécharger l'attestation"
        format="pdf"
        url={Routes.Document.télécharger(
          DocumentProjet.convertirEnValueType(
            identifiantProjet,
            'attestation',
            notifiéLe,
            format,
          ).formatter(),
        )}
      />
    ) : undefined,
  };
};
