import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { getAchèvement, getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { DocumentItem, DocumentsList } from './DocumentsDétails';

type DocumentsSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Documents';
export const DocumentsSection = ({ identifiantProjet }: DocumentsSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const documents: Array<DocumentItem> = [];

      const lauréat = await getLauréatInfos(identifiantProjet);

      documents.push({
        type: 'Export du projet',
        date: DateTime.now().formatter(),
        format: 'csv',
        url: Routes.Lauréat.exporter({ nomProjet: lauréat.nomProjet }),
        documentKey: undefined,
        peutÊtreTéléchargé: rôle.aLaPermission('lauréat.listerLauréatEnrichi'),
      });

      const { attestationDésignation } = await getLauréatInfos(identifiantProjet);

      if (attestationDésignation) {
        documents.push({
          type: attestationDésignation.typeDocument,
          date: attestationDésignation.dateCréation,
          format: attestationDésignation.format,
          documentKey: attestationDésignation.formatter(),
          url: undefined,
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
          url: undefined,
          peutÊtreTéléchargé: true,
        });

        if (Option.isSome(achèvement.preuveTransmissionAuCocontractant)) {
          documents.push({
            type: achèvement.preuveTransmissionAuCocontractant.typeDocument,
            date: achèvement.preuveTransmissionAuCocontractant.dateCréation,
            format: achèvement.preuveTransmissionAuCocontractant.format,
            documentKey: achèvement.preuveTransmissionAuCocontractant.formatter(),
            url: undefined,
            peutÊtreTéléchargé: true,
          });
        }
      }

      // ajouter les documents des demandes, voir selon les rôles pour le get
      // garanties financières attestation de conformité
      // raccordement ?
      // trier les documents par date

      return <DocumentsList documents={documents} />;
    }),
    sectionTitle,
  );
