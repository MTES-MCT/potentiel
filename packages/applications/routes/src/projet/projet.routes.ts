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
  periodeId?: string;
  familleId?: string;
  nomProjet?: string;
};

/**
 *
 * @deprecated Lien pour générer un document CSV
 */
export const exportCsv = ({
  appelOffreId,
  periodeId,
  familleId,
  nomProjet,
  statut,
}: ExportCsvFilters) => {
  const searchParams = new URLSearchParams();

  // mapping avec les statuts legacy, sachant que :
  // - le front ne propose pas d'export de tous les projets Lauréats ET Éliminés
  // - achevé n'existe pas dans le legacy
  // - actif est considéré comme "classé" dans le legacy, puisque achevé n'existe pas
  const classementLegacy = match(statut)
    .returnType<'classé' | 'actif' | 'abandonné' | 'éliminé'>()
    .with(undefined, () => 'classé')
    .with('achevé', () => 'actif')
    .with('actif', () => 'actif')
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

  if (periodeId) {
    searchParams.append('periodeId', periodeId);
  }

  if (familleId) {
    searchParams.append('familleId', familleId);
  }

  return `/export-liste-projets.csv${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détailsÉliminé = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}`;
