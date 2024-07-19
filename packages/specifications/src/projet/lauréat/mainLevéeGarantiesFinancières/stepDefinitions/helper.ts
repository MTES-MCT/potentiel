import { IdentifiantProjet } from '@potentiel-domain/common';

const defaultMotif = 'projet-achevé';
const defaultUtilisateur = 'porteur@test.test';
const defaultDateDemande = '2024-05-01';
export const defaultDateRejetOuAccord = '2024-06-01';

type SetMainlevéeDataProps = {
  motif?: string;
  utilisateur?: string;
  dateDemande?: string;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setDemandeMainlevéeData = ({
  motif,
  utilisateur,
  dateDemande,
  identifiantProjet,
}: SetMainlevéeDataProps) => {
  return {
    identifiantProjetValue: identifiantProjet.formatter(),
    motifValue: motif || defaultMotif,
    demandéLeValue: new Date(dateDemande || defaultDateDemande).toISOString(),
    demandéParValue: utilisateur || defaultUtilisateur,
  };
};
