import { encodeParameter } from '../encodeParameter';

export const modifierSiteDeProduction = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/site-de-production/modifier`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier`;

export const lister = () => `/laureats`;

export const changement = {
  nomProjet: {
    enregistrer: (identifiantProjet: string) =>
      `/laureats/${encodeParameter(identifiantProjet)}/nom-projet/changement/enregistrer`,
    détails: (identifiantProjet: string, enregistréLe: string) =>
      `/laureats/${encodeParameter(identifiantProjet)}/nom-projet/changement/${enregistréLe}`,
    lister: `/laureats/changements/nom-projet`,
  },
};
