import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

export const defaultMotif = 'projet-achevé';
export const defaultUtilisateur = 'porteur@test.test';
export const defaultDateDemande = '2024-01-01';
export const defaultDateRejetOuAccord = '2024-06-01';
export const defaultDocumentFormat = 'application/pdf';
export const defaultDocumentContenu = 'contenu du fichier';

const defaultMainlevéeData = {
  demande: {
    date: '2024-05-01',
    motif: 'projet-achevé',
    utilisateur: 'porteur@test.test',
  },
  instruction: { date: '2024-06-01' },
  rejetOuAccord: {
    date: '2024-06-01',
    utilisateur: 'porteur@test.test',
    documentFormat: 'application/pdf',
    documentContenu: 'contenu du fichier',
  },
};

type SetDemandeMainlevéeDataProps = Partial<(typeof defaultMainlevéeData)['demande']> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setDemandeMainlevéeData = ({
  motif,
  utilisateur,
  date,
  identifiantProjet,
}: SetDemandeMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    motifValue: motif || defaultMainlevéeData.demande.motif,
    demandéLeValue: new Date(date || defaultMainlevéeData.demande.date).toISOString(),
    demandéParValue: utilisateur || defaultMainlevéeData.demande.utilisateur,
  };
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
