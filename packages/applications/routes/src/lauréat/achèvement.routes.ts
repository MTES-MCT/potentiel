import { encodeParameter } from '../encodeParameter';

export const transmettreAttestationConformité = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/achevement/attestation-conformite:transmettre`;

export const modifierAttestationConformité = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/achevement/attestation-conformite:modifier`;
