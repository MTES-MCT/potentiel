import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
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

      const { attestationDésignation } = await getLauréatInfos(identifiantProjet);

      if (attestationDésignation) {
        documents.push({
          type: attestationDésignation.typeDocument,
          date: attestationDésignation.dateCréation,
          format: attestationDésignation.format,
          documentKey: attestationDésignation.formatter(),
          peutÊtreTéléchargé: true,
        });
        documents.push({
          type: attestationDésignation.typeDocument,
          date: attestationDésignation.dateCréation,
          format: attestationDésignation.format,
          documentKey: attestationDésignation.formatter(),
          peutÊtreTéléchargé: false,
        });
      }

      return <DocumentsList documents={documents} />;
    })(),
    sectionTitle,
  );
