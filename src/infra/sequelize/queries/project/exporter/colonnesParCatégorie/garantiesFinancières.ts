import { literal } from 'sequelize';
import { Colonne } from '../Colonne';

export const garantiesFinancières: Readonly<Array<Colonne>> = [
  {
    source: 'expression-sql',
    expressionSql: literal(`TO_CHAR("garantiesFinancières"."dateEnvoi", 'DD/MM/YYYY')`),
    aliasColonne: 'dateEnvoi',
    intitulé: `Date de soumission sur Potentiel des garanties financières`,
  },
  {
    source: 'expression-sql',
    expressionSql: literal(`TO_CHAR("garantiesFinancières"."dateConstitution", 'DD/MM/YYYY')`),
    aliasColonne: 'dateConstitution',
    intitulé: `Date déclarée par le porteur de dépôt des garanties financières`,
  },
];
