import { Lauréat } from '@potentiel-domain/projet';

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
  classement?: Exclude<Lauréat.StatutLauréat.RawType, 'achevé'> | 'éliminé';
  appelOffreId?: string;
  nomProjet?: string;
};

/**
 *
 * @deprecated Lien pour générer un document CSV
 */
export const exportCsv = ({ appelOffreId, nomProjet, classement }: exportCsvFilters) => {
  const searchParams = new URLSearchParams();

  if (classement) {
    searchParams.append('classement', classement);
  }

  if (appelOffreId) {
    searchParams.append('appelOffreId', appelOffreId);
  }

  if (nomProjet) {
    searchParams.append('recherche', nomProjet);
  }

  return `/export-liste-projets.csv${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détailsÉliminé = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}`;

/**
 *
 * @deprecated Lien vers la page liste des projets legacy
 *
 */
export const lister = () => `/projets.html`;
