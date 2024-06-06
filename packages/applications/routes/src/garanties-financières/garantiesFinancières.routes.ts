import { encodeParameter } from '../encodeParameter';

export const dépôt = {
  soumettre: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:soumettre`,
  modifier: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:modifier`,
  lister: `/garanties-financieres/depots-en-cours`,
};

export const actuelles = {
  modifier: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/actuelles:modifier`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/actuelles:enregistrer`,
  enregistrerAttestation: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(
      identifiantProjet,
    )}/garanties-financieres/actuelles:enregistrer-attestation`,
};

export const demandeMainlevée = {
  lister: `/garanties-financieres/demandes-mainlevee-en-cours`,
};

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres`;

export const téléchargerModèleMiseEnDemeure = (identitifiantProjet: string) =>
  `/laureats/${encodeParameter(identitifiantProjet)}/garanties-financieres/modele-mise-en-demeure`;

export const enAttente = {
  lister: `/garanties-financieres/projets-en-attente`,
};

export const mainlevée = {
  instruire: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/mainlevee:instruire`,
};
