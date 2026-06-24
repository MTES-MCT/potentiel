import { withFilters } from '../_helpers/withFilters.js';
import { encodeParameter } from '../encodeParameter.js';

export const lister = () => `/elimines`;

export const détails = {
  tableauDeBord: (identifiantProjet: string) => `/elimines/${encodeParameter(identifiantProjet)}`,
  utilisateurs: (identifiantProjet: string) =>
    `/elimines/${encodeParameter(identifiantProjet)}/utilisateurs`,
  documents: (identifiantProjet: string) =>
    `/elimines/${encodeParameter(identifiantProjet)}/documents`,
};

export const exporter = withFilters<{
  appelOffre?: string[];
  periode?: string;
  famille?: string;
  typeActionnariat?: string[];
  identifiantProjet?: string;
}>(`/elimines/export`);
