import { encodeParameter } from '../encodeParameter';

export const changementNomProjet = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/nom-projet/changement/demander`;

export const modifierSiteDeProduction = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/site-de-production/modifier`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier`;

export const lister = () => `/laureats`;
