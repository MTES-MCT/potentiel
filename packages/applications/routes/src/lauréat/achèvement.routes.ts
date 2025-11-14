import { encodeParameter } from '../encodeParameter';

export const transmettreDateAchèvement = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/achevement/date-achevement:transmettre`;

export const transmettreAttestationConformité = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/achevement/attestation-conformite:transmettre`;

export const modifierAttestationConformité = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/achevement/attestation-conformite:modifier`;
