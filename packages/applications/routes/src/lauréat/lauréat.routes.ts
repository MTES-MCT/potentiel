import { encodeParameter } from '../encodeParameter';

export const lister = () => `/laureats`;

export const détails = (
  identifiantProjet: string,
  feedback?: {
    type: 'success' | 'error';
    message: string;
  },
) => {
  const url = `/laureats/${encodeParameter(identifiantProjet)}`;
  const searchParams = new URLSearchParams();

  if (feedback?.type === 'success') {
    searchParams.append('success', feedback.message);
  }
  if (feedback?.type === 'error') {
    searchParams.append('error', feedback.message);
  }

  if (searchParams.size === 0) {
    return url;
  }
  return `${url}?${searchParams.toString()}`;
};

export const modifierSiteDeProduction = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/site-de-production/modifier`;

export const modifierNomProjet = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/nom-projet/modifier`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier`;

export const changement = {
  nomProjet: {
    enregistrer: (identifiantProjet: string) =>
      `/laureats/${encodeParameter(identifiantProjet)}/nom-projet/changement/enregistrer`,
    détails: (identifiantProjet: string, enregistréLe: string) =>
      `/laureats/${encodeParameter(identifiantProjet)}/nom-projet/changement/${enregistréLe}`,
    lister: `/laureats/changements/nom-projet`,
  },
};
