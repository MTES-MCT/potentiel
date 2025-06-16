import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToAchèvementTimelineItemProps } from '../mapToAchèvementTimelineItemProps';

export const mapToAttestationConformitéTransmiseTimelineItemProps: MapToAchèvementTimelineItemProps =
  (abandonAccordé, icon) => {
    const {
      identifiantProjet,
      attestation: { format },
      date,
    } = abandonAccordé.payload as Lauréat.Achèvement.AttestationConformitéTransmiseEvent['payload'];

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      Lauréat.Achèvement.TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
      date,
      format,
    ).formatter();

    return {
      date,
      icon,
      title: <div>Projet achevé</div>,
      content: (
        <DownloadDocument
          className="mb-0"
          label="Télécharger l'attestation de conformité"
          format="pdf"
          url={Routes.Document.télécharger(attestation)}
        />
      ),
    };
  };
