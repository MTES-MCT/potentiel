import models from '../../../models'
import { wrapInfra } from '@core/utils'
import { Project } from '@infra/sequelize/projections'

const { Project: ProjectModel } = models

export const getProjetsListePourAdmin = (listeColonnes: string[]) => {
  return wrapInfra(ProjectModel.findAll()).map((projets: any) =>
    projets.map((projet: Project) =>
      listeColonnes.reduce(
        (liste, colonne) => ({
          ...liste,
          [colonne]: projet[colonne] || (projet['details'] && projet['details'][colonne]),
        }),
        {}
      )
    )
  )
}
