import { literal } from 'sequelize'
import { Colonne } from '../Colonne'

export const garantiesFinancières: Readonly<Array<Colonne>> = [
  {
    literal: literal(`TO_CHAR("garantiesFinancières"."dateEnvoi", 'DD/MM/YYYY')`),
    alias: 'dateEnvoi',
    intitulé: `Date de soumission sur Potentiel des garanties financières`,
  },
  {
    literal: literal(`TO_CHAR("garantiesFinancières"."dateConstitution", 'DD/MM/YYYY')`),
    alias: 'dateConstitution',
    intitulé: `Date déclarée par le porteur de dépôt des garanties financières`,
  },
]
