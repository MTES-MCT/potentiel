import { Routes } from '@potentiel-applications/routes';
import { Éliminé } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToÉliminéNotifiéTimelineItemProps = (modification: Éliminé.ÉliminéNotifiéEvent) => {
  const {
    identifiantProjet,
    notifiéLe,
    attestation: { format },
  } = modification.payload;

  return {
    date: notifiéLe,
    title: <div>Projet notifié éliminé</div>,
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
