import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

export const defaultMotif = 'projet-achevé';
export const defaultUtilisateur = 'porteur@test.test';
export const defaultDateDemande = '2024-01-01';
export const defaultDateRejetOuAccord = '2024-06-01';
export const defaultDocumentFormat = 'application/pdf';
export const defaultDocumentContenu = 'contenu du fichier';

const defaultDemandeDataProps = {
  motif: 'projet-achevé',
  utilisateur: 'porteur@test.test',
  dateDemande: '2024-05-01',
  dateRejetOuAccord: '2024-06-01',
};

type SetDemandeMainlevéeDataProps = Partial<typeof defaultDemandeDataProps> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setDemandeMainlevéeData = ({
  motif,
  utilisateur,
  dateDemande,
  identifiantProjet,
}: SetDemandeMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    motifValue: motif || defaultMotif,
    demandéLeValue: new Date(dateDemande || defaultDateDemande).toISOString(),
    demandéParValue: utilisateur || defaultUtilisateur,
  };
};

export const setRejetMainlevéeData = ({
  motif,
  utilisateur,
  dateDemande,
  identifiantProjet,
}: SetDemandeMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    motifValue: motif || defaultMotif,
    demandéLeValue: new Date(dateDemande || defaultDateDemande).toISOString(),
    demandéParValue: utilisateur || defaultUtilisateur,
  };
};

type SetAccordMainlevéeDataProps = {
  dateAccordé?: string;
  utilisateur?: string;
  documentFormat?: string;
  documentContenu?: string;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setAccordMainlevéeData = ({
  dateAccordé,
  utilisateur,
  documentFormat,
  documentContenu,
  identifiantProjet,
}: SetAccordMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    accordéLeValue: new Date(dateAccordé || defaultDateRejetOuAccord).toISOString(),
    accordéParValue: utilisateur || defaultUtilisateur,
    réponseSignéeValue: {
      format: documentFormat || defaultDocumentFormat,
      content: convertStringToReadableStream(documentContenu || defaultDocumentContenu),
    },
  };
};
