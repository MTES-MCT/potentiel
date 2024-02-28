import { encodeParameter } from '../encodeParameter';

export const soumettre = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres:soumettre`;

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres:modifier`;
