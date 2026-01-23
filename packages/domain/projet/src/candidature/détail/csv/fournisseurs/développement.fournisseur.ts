import { Candidature } from '../../../..';

export const CSVDétailKeys: Partial<Array<keyof Candidature.DétailCandidature.RawType>> = [
  /**
   * TODO :
   * - Analyse des données existantes (Developpement vs Développement)
   * - Pourquoi un Développement 2 ?
   */
  'Contenu local européen (%) (Developpement)',
  'Contenu local européen (%) (Développement)',
  'Contenu local européen (%) (Développement)2',

  'Contenu local français (%) (Developpement)',
  'Contenu local français (%) (Développement)',
  'Contenu local français (%) (Développement)2',

  'Coût total du lot (M€) (Développement)',
  'Coût total du lot (Mi) (Developpement)',
  'Coût total du lot (M€) (Développement)2',
];
