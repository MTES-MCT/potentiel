import { encodeParameter } from '../encodeParameter';

export const lister = () => `/elimines`;
export const détails = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}`;

export const exporter = (filters: {
  appelOffre?: string[];
  periode?: string;
  famille?: string;
  typeActionnariat?: string[];
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
  if (filters.typeActionnariat?.length) {
    filters.typeActionnariat.forEach((value) => {
      searchParams.append('typeActionnariat', value);
    });
  }
  return `/elimines/export${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};
