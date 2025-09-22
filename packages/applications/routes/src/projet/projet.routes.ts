import { encodeParameter } from '../encodeParameter';

/**
 *
 * @deprecated Lien vers la page projet legacy
 */
export const details = (
  identifiantProjet: string,
  feedback?: {
    type: 'success' | 'error';
    message: string;
  },
) =>
  `/projet/${encodeParameter(identifiantProjet)}/details.html${feedback ? `?${feedback.type === 'success' ? `success=${feedback.message}` : `error=${feedback.message}`}` : ''}`;

type exportCsvFilters = {
  classement: 'classés';
  appelOffreId?: string;
  nomProjet?: string;
};

/**
 *
 * @deprecated Lien pour générer un document CSV
 */
export const exportCsv = (filters: exportCsvFilters) => {
  const searchParams = new URLSearchParams();

  searchParams.append('classement', filters.classement);

  if (filters.appelOffreId) {
    searchParams.append('appelOffreId', filters.appelOffreId);
  }

  if (filters.nomProjet) {
    searchParams.append('recherche', filters.nomProjet);
  }

  return `/export-liste-projets.csv${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détailsÉliminé = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}`;

export const lister = () => `/projets.html`;
