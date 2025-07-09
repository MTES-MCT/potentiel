import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToLauréatNotifiéTimelineItemProps = (
  modification: Lauréat.LauréatNotifiéEvent | Lauréat.LauréatNotifiéV1Event,
) => {
  const { identifiantProjet, notifiéLe } = modification.payload;

  return {
    date: notifiéLe,
    title: <div>Projet notifié</div>,
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger l'attestation"
        format="pdf"
        url={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
      />
    ),
  };
};
