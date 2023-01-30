import { literal } from 'sequelize'
import { Colonne } from '../Colonne'

export const financementCitoyen: Readonly<Array<Colonne>> = [
  {
    champ: literal(`CASE WHEN "isInvestissementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
    intitulé: 'Investissement participatif (Oui/Non)',
  },
  {
    champ: literal(`CASE WHEN "isFinancementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
    intitulé: 'Financement participatif (Oui/Non)',
  },
  { champ: `€/MWh bonus participatif`, details: true },
  {
    champ: literal(`CASE WHEN "actionnariat" = 'financement-collectif' THEN 'Oui' ELSE '' END`),
    intitulé: 'Financement collectif (Oui/Non)',
  },
  {
    champ: literal(`CASE WHEN "actionnariat" = 'gouvernance-partagee' THEN 'Oui' ELSE '' END`),
    intitulé: 'Gouvernance partagée (Oui/Non)',
  },
]
