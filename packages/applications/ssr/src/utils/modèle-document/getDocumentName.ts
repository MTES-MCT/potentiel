import { formatIdentifiantProjetForDocument } from './formatIdentifiantProjetForDocument';

export const getDocumentName = (name: string, identifiantProjet: string, type: string) => {
  const dateStr = new Intl.DateTimeFormat('fr').format(new Date()).replaceAll('/', '-');
  const refPotentiel = formatIdentifiantProjetForDocument(identifiantProjet);

  return `${type}_${dateStr}_${refPotentiel}_${encodeURIComponent(name)}.docx`;
};
