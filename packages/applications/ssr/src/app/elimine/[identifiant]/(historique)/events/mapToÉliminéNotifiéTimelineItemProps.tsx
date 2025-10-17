import { Routes } from '@potentiel-applications/routes';
import { Éliminé } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToÉliminéNotifiéTimelineItemProps = (
  modification: Éliminé.ÉliminéNotifiéEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    notifiéLe,
    attestation: { format },
  } = modification.payload;

  return {
    date: notifiéLe,
    title: 'Projet notifié éliminé',
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger l'avis de rejet"
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
    ),
  };
};
