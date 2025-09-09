import { IdentifiantProjet } from '@potentiel-domain/projet';

import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

export const defaultMainlevéeData = {
  demande: {
    date: '2024-05-01',
    motif: 'projet-achevé',
    utilisateur: 'porteur@test.test',
  },
  instruction: { date: '2024-05-15', utilisateur: 'dreal@test.test' },
  rejetOuAccord: {
    date: '2024-06-01',
    utilisateur: 'dreal@test.test',
    documentFormat: 'application/pdf',
    documentContenu: 'contenu du fichier',
  },
};

type SetRejetMainlevéeDataProps = Partial<(typeof defaultMainlevéeData)['rejetOuAccord']> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setRejetMainlevéeData = ({
  date,
  utilisateur,
  documentFormat,
  documentContenu,
  identifiantProjet,
}: SetRejetMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    rejetéLeValue: new Date(date || defaultMainlevéeData.rejetOuAccord.date).toISOString(),
    rejetéParValue: utilisateur || defaultMainlevéeData.rejetOuAccord.utilisateur,
    réponseSignéeValue: {
      format: documentFormat || defaultMainlevéeData.rejetOuAccord.documentFormat,
      content: convertStringToReadableStream(
        documentContenu || defaultMainlevéeData.rejetOuAccord.documentContenu,
      ),
    },
  };
};

type SetAccordMainlevéeDataProps = Partial<(typeof defaultMainlevéeData)['rejetOuAccord']> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setAccordMainlevéeData = ({
  date,
  utilisateur,
  documentFormat,
  documentContenu,
  identifiantProjet,
}: SetAccordMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    accordéLeValue: new Date(date || defaultMainlevéeData.rejetOuAccord.date).toISOString(),
    accordéParValue: utilisateur || defaultMainlevéeData.rejetOuAccord.utilisateur,
    réponseSignéeValue: {
      format: documentFormat || defaultMainlevéeData.rejetOuAccord.documentFormat,
      content: convertStringToReadableStream(
        documentContenu || defaultMainlevéeData.rejetOuAccord.documentContenu,
      ),
    },
  };
};
