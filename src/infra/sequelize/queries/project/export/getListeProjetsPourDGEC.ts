import models from '../../../models'
import { wrapInfra } from '@core/utils'
import { Project } from '@infra/sequelize/projections'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../lister/requêtes/mapToFindOptions'

const { Project: ProjectModel } = models

export const getProjetsListePourDGEC = ({
  listeColonnes,
  filtres,
}: {
  listeColonnes: string[]
  filtres?: FiltreListeProjets
}) => {
  return wrapInfra(ProjectModel.findAll({ ...(filtres && mapToFindOptions(filtres)) })).map(
    (projets: any) =>
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
