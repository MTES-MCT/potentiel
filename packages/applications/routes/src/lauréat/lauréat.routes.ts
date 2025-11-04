import { encodeParameter } from '../encodeParameter';

export const changement = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/site-de-production:modifier`;

export const modifierSiteDeProduction = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/site-de-production:modifier`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier`;

export const lister = () => `/laureats`;
