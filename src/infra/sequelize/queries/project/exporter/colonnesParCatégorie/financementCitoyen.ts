import { literal } from 'sequelize'
import { Colonne } from '../Colonne'

export const financementCitoyen: Readonly<Array<Colonne>> = [
  {
    literal: literal(`CASE WHEN "isInvestissementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
    alias: 'isInvestissementParticipatif',
    intitulé: 'Investissement participatif (Oui/Non)',
  },
  {
    literal: literal(`CASE WHEN "isFinancementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
    alias: 'isFinancementParticipatif',
    intitulé: 'Financement participatif (Oui/Non)',
  },
  { champ: `€/MWh bonus participatif`, details: true },
  {
    literal: literal(`CASE WHEN "actionnariat" = 'financement-collectif' THEN 'Oui' ELSE '' END`),
    alias: 'financementCollectif',
    intitulé: 'Financement collectif (Oui/Non)',
  },
  {
    literal: literal(`CASE WHEN "actionnariat" = 'gouvernance-partagee' THEN 'Oui' ELSE '' END`),
    alias: 'gouvernancePartagee',
    intitulé: 'Gouvernance partagée (Oui/Non)',
  },
]
