import { formatIdentifiantProjetForDocument } from './formatIdentifiantProjetForDocument';

export const getDocumentHeader = (identifiantProjet: string, nomProjet: string, type: string) => {
  const dateStr = new Intl.DateTimeFormat('fr').format(new Date()).replaceAll('/', '-');
  const refPotentiel = formatIdentifiantProjetForDocument(identifiantProjet);

  return {
    'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Modèle : 2025-01-08_Eolien - 1 - 2 - 3_actionnaire_[TEST] Projet 01.docx
    'content-disposition': `attachment; filename="${dateStr}_${refPotentiel}_${type}_${encodeURIComponent(nomProjet)}.docx"`,
  };
};
