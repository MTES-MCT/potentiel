import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToLauréatNotifiéTimelineItemProps = (
  modification: Lauréat.LauréatNotifiéEvent | Lauréat.LauréatNotifiéV1Event,
  doitAfficherLienAttestationDésignation: boolean,
) => {
  const {
    identifiantProjet,
    notifiéLe,
    attestation: { format },
  } = modification.payload;

  return {
    date: notifiéLe,
    title: <div>Projet notifié lauréat</div>,
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
