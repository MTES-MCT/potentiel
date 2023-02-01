import { literal } from 'sequelize'
import { Colonne } from '../Colonne'

export const financementCitoyen: Readonly<Array<Colonne>> = [
  {
    source: 'expression-sql',
    expressionSql: literal(
      `CASE WHEN "isInvestissementParticipatif" = 'true' THEN 'Oui' ELSE '' END`
    ),
    aliasColonne: 'isInvestissementParticipatif',
    intitulé: 'Investissement participatif (Oui/Non)',
  },
  {
    source: 'expression-sql',
    expressionSql: literal(`CASE WHEN "isFinancementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
    aliasColonne: 'isFinancementParticipatif',
    intitulé: 'Financement participatif (Oui/Non)',
  },
  { source: 'propriété-colonne-détail', nomPropriété: `€/MWh bonus participatif` },
  {
    source: 'expression-sql',
    expressionSql: literal(
      `CASE WHEN "actionnariat" = 'financement-collectif' THEN 'Oui' ELSE '' END`
    ),
    aliasColonne: 'financementCollectif',
    intitulé: 'Financement collectif (Oui/Non)',
  },
  {
    source: 'expression-sql',
    expressionSql: literal(
      `CASE WHEN "actionnariat" = 'gouvernance-partagee' THEN 'Oui' ELSE '' END`
    ),
    aliasColonne: 'gouvernancePartagee',
    intitulé: 'Gouvernance partagée (Oui/Non)',
  },
]
