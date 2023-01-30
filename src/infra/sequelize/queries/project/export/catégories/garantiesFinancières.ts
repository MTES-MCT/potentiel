import { literal } from 'sequelize'
import { Colonne } from '../Colonne'

export const garantiesFinancières: Readonly<Array<Colonne>> = [
  {
    champ: literal(`TO_CHAR("garantiesFinancières"."dateEnvoi", 'DD/MM/YYYY')`),
    intitulé: `Date de soumission sur Potentiel des garanties financières`,
  },
  {
    champ: literal(`TO_CHAR("garantiesFinancières"."dateConstitution", 'DD/MM/YYYY')`),
    intitulé: `Date déclarée par le porteur de dépôt des garanties financières`,
  },
]
