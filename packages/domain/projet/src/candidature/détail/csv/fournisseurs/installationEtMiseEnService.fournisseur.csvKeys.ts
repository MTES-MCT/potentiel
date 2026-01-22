import { allCandidatureCSVDetailsKeys } from '../../allDétailCandidatureCSVKeys';

export const fournisseurInstallationEtMiseEnServiceCSVDetailsKeys: Array<
  (typeof allCandidatureCSVDetailsKeys)[number]
> = [
  'Contenu local européen (%) (Installation et mise en service)',
  'Contenu local français (%) (Installation et mise en service)',
  /**
   * TODO : Modifier le nom de la clé (enlever l'espace avant le 2ème parenthèse) ??
   */
  'Coût total du lot (M€) (Installation et mise en service )',
];
