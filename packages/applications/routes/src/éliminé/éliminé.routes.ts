import { encodeParameter } from '../encodeParameter';

export const lister = () => `/elimines`;

export const détails = {
  tableauDeBord: (identifiantProjet: string) => `/elimines/${encodeParameter(identifiantProjet)}`,
  utilisateurs: (identifiantProjet: string) =>
    `/elimines/${encodeParameter(identifiantProjet)}/utilisateurs`,
  documents: (identifiantProjet: string) =>
    `/elimines/${encodeParameter(identifiantProjet)}/documents`,
};

export const exporter = (filters: {
  appelOffre?: string[];
  periode?: string;
  famille?: string;
  typeActionnariat?: string[];
  nomProjet?: string;
}) => {
  const searchParams = new URLSearchParams();

  if (filters.appelOffre?.length) {
    filters.appelOffre.forEach((value) => {
      searchParams.append('appelOffre', value);
    });
  }
  if (filters.periode) {
    searchParams.append('periode', filters.periode);
  }
  if (filters.famille) {
    searchParams.append('famille', filters.famille);
  }
  if (filters.nomProjet) {
    searchParams.append('nomProjet', filters.nomProjet);
  }
  if (filters.typeActionnariat?.length) {
    filters.typeActionnariat.forEach((value) => {
      searchParams.append('typeActionnariat', value);
    });
  }
  return `/elimines/export${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};
