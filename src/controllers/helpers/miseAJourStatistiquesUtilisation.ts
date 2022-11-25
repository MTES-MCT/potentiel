import { Données, StatistiquesUtilisation } from '@infra/sequelize/tableModels'

type MiseAJourStatistiquesUtilisationArgs = { type: string; date?: Date; données: Données }

export const miseAJourStatistiquesUtilisation = ({
  type,
  date,
  données,
}: MiseAJourStatistiquesUtilisationArgs) => {
  StatistiquesUtilisation.create({ type, ...(date && { date }), données })
}
