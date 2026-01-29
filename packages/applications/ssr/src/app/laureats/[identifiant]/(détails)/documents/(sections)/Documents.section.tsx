import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { getAchèvement, getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';

import { DocumentItem, DocumentsList } from './DocumentsDétails';

type DocumentsSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Documents';
export const DocumentsSection = ({ identifiantProjet }: DocumentsSectionProps) =>
  SectionWithErrorHandling(
    (async () => {
      const documents: Array<DocumentItem> = [];

      documents.push({
        type: 'Export du projet',
        date: DateTime.now().formatter(),
        format: 'csv',
        // ajouter un filtre sur l'identifiant projet
        documentKey: Routes.Lauréat.exporter({}),
        // qui peut télécharger l'export
        peutÊtreTéléchargé: true,
      });

      const { attestationDésignation } = await getLauréatInfos(identifiantProjet);

      if (attestationDésignation) {
        documents.push({
          type: attestationDésignation.typeDocument,
          date: attestationDésignation.dateCréation,
          format: attestationDésignation.format,
          documentKey: attestationDésignation.formatter(),
          peutÊtreTéléchargé: true,
        });
      }

      const achèvement = await getAchèvement(identifiantProjet);

      if (achèvement.estAchevé) {
        documents.push({
          type: achèvement.attestation.typeDocument,
          date: achèvement.attestation.dateCréation,
          format: achèvement.attestation.format,
          documentKey: achèvement.attestation.formatter(),
          peutÊtreTéléchargé: true,
        });

        if (Option.isSome(achèvement.preuveTransmissionAuCocontractant)) {
          documents.push({
            type: achèvement.preuveTransmissionAuCocontractant.typeDocument,
            date: achèvement.preuveTransmissionAuCocontractant.dateCréation,
            format: achèvement.preuveTransmissionAuCocontractant.format,
            documentKey: achèvement.preuveTransmissionAuCocontractant.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

      // ajouter les documents des demandes, voir selon les rôles pour le get

      return <DocumentsList documents={documents} />;
    })(),
    sectionTitle,
  );
