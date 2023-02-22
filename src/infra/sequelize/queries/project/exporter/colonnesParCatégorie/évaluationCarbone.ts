import { Colonne } from '../Colonne';

export const évaluationCarbone: Readonly<Array<Colonne>> = [
  {
    nomColonneTableProjet: 'evaluationCarbone',
    source: 'champ-simple',
    intitulé:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  },
  {
    nomPropriété: `Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)`,
    source: 'propriété-colonne-détail',
  },
];
