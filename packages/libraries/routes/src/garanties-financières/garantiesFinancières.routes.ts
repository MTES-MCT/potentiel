import { encodeParameter } from '../encodeParameter';

export const dépôt = {
  soumettre: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:soumettre`,
  modifier: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:modifier`,
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

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres`;
