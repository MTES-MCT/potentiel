import { allCandidatureCSVDetailsKeys } from '../../allDétailCandidatureCSVKeys';

export const fournisseurGenieCivilCSVDetailsKeys: Array<
  (typeof allCandidatureCSVDetailsKeys)[number]
> = [
  /**
   * TODO : Vérifier avec le métier les clés suivantes qui semblent dupliquées + analyse données
   */
  'Contenu local européen (%) (génie civil)',
  'Contenu local européen (%) (Génie civil)',

  'Contenu local français (%) (génie civil)',
  'Contenu local français (%) (Génie civil)',

  'Coût total du lot (M€) (génie civil)',
  'Coût total du lot (Mi) (Génie civil)',
];
