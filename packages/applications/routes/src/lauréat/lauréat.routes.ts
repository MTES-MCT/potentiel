import { encodeParameter } from '../encodeParameter';

export const lister = () => `/laureats`;

export const détails = {
  tableauDeBord: (identifiantProjet: string) => `/laureats/${encodeParameter(identifiantProjet)}`,
  informationGénérales: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/informations-generales`,
  installation: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/installation`,
  évaluationCarbone: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/evaluation-carbone`,
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

export const exporter = (filters: {
  appelOffre?: string;
  periode?: string;
  famille?: string;
  statut?: string;
  typeActionnariat?: string[];
}) => {
  const searchParams = new URLSearchParams();

  if (filters.appelOffre) {
    searchParams.append('appelOffre', filters.appelOffre);
  }
  if (filters.periode) {
    searchParams.append('periode', filters.periode);
  }
  if (filters.famille) {
    searchParams.append('famille', filters.famille);
  }
  if (filters.statut) {
    searchParams.append('statut', filters.statut);
  }
  if (filters.typeActionnariat?.length) {
    filters.typeActionnariat.forEach((value) => {
      searchParams.append('typeActionnariat', value);
    });
  }
  return `/laureats/export${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};
