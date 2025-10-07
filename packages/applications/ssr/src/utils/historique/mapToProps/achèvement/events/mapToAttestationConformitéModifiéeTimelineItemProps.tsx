import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToAttestationConformitéModifiéeTimelineItemProps: HistoriqueItem<
  Lauréat.Achèvement.AttestationConformité.AttestationConformitéModifiéeEvent
> = ({ event }) => {
  const {
    identifiantProjet,
    attestation: { format },
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    date,
    utilisateur,
  } = event.payload;

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.AttestationConformité.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
    date,
    format,
  ).formatter();

  const preuveTransmission = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.AttestationConformité.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant.format,
  ).formatter();

  return {
    date,
    title: <div>Modification de l'attestation de conformité</div>,
    content: (
      <div className="flex flex-col gap-2">
        <DownloadDocument
          className="mb-0"
          label="Télécharger l'attestation de conformité"
          format="pdf"
          url={Routes.Document.télécharger(attestation)}
        />
        <DownloadDocument
          className="mb-0"
          label="Télécharger la preuve de transmission au cocontractant"
          format="pdf"
          url={Routes.Document.télécharger(preuveTransmission)}
        />
        <div>
          Date de transmission au cocontractant :{' '}
          <span className="font-semibold">
            {<FormattedDate date={dateTransmissionAuCocontractant} />}
          </span>
        </div>
        <div>
          Modification faite par : <span className="font-semibold">{utilisateur}</span>
        </div>
      </div>
    ),
  };
};
