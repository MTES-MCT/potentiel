import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier`;

export const modifierNomLocalité = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier/nom-localite`;
