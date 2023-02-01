import { Colonne } from '../Colonne'

export const évaluationCarbone: Readonly<Array<Colonne>> = [
  {
    champ: 'evaluationCarbone',
    intitulé:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  },
  {
    champ: `Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)`,
    details: true,
  },
]
