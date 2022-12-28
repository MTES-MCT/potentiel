import { Données, StatistiquesUtilisation } from '@infra/sequelize/tableModels'

type MiseAJourStatistiquesUtilisationArgs = {
  type: string
  données: Données
}

export const miseAJourStatistiquesUtilisation = ({
  type,
  données,
}: MiseAJourStatistiquesUtilisationArgs) => {
  StatistiquesUtilisation.create({ type, données })
}
