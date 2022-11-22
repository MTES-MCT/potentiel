import { Données, StatistiquesUtilisation } from '@infra/sequelize/tableModels'

type MiseAJourStatistiquesUtilisationProps = { type: string; données: Données }

export const miseAJourStatistiquesUtilisation = ({
  type,
  données,
}: MiseAJourStatistiquesUtilisationProps) => {
  StatistiquesUtilisation.create({ type, données })
}
