import { Données, StatistiquesUtilisation } from '@infra/sequelize/tableModels'

type MiseAJourStatistiquesUtilisationProps = { type: string; date: Date; données: Données }

export const miseAJourStatistiquesUtilisation = ({
  type,
  date,
  données,
}: MiseAJourStatistiquesUtilisationProps) => {
  StatistiquesUtilisation.create({ type, date, données })
}
