import { formatIdentifiantProjetForDocument } from './formatIdentifiantProjetForDocument';

type GetDocxDocumentHeader = {
  identifiantProjet: string;
  nomProjet: string;
  type: string;
};

export const getDocxDocumentHeader = ({
  identifiantProjet,
  nomProjet,
  type,
}: GetDocxDocumentHeader) => {
  const dateStr = new Intl.DateTimeFormat('fr').format(new Date()).replaceAll('/', '-');
  const refPotentiel = formatIdentifiantProjetForDocument(identifiantProjet);

  return {
    'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Modèle : 2025-01-08_Eolien - 1 - 2 - 3_actionnaire_[TEST] Projet 01.docx
    'content-disposition': `attachment; filename="${dateStr}_${refPotentiel}_${type}_${encodeURIComponent(nomProjet)}.docx"`,
  };
};
