import { match } from 'ts-pattern';

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

type ExportCsvFilters = {
  statut?: Lauréat.StatutLauréat.RawType | 'éliminé';
  appelOffreId?: string;
  nomProjet?: string;
};

/**
 *
 * @deprecated Lien pour générer un document CSV
 */
export const exportCsv = ({ appelOffreId, nomProjet, statut }: ExportCsvFilters) => {
  const searchParams = new URLSearchParams();

  // mapping avec les statuts legacy, sachant que :
  // - le front ne propose pas d'export de tous les projets Lauréats ET Éliminés
  // - achevé n'existe pas dans le legacy
  // - actif est considéré comme "classé" dans le legacy, puisque achevé n'existe pas
  const classementLegacy = match(statut)
    .returnType<'classé' | 'abandonné' | 'éliminé'>()
    .with(undefined, () => 'classé')
    .with('achevé', () => 'classé')
    .with('actif', () => 'classé')
    .with('abandonné', () => 'abandonné')
    .with('éliminé', () => 'éliminé')
    .exhaustive();
  searchParams.append('classement', classementLegacy);

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
