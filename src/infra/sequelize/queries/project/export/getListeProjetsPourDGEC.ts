import models from '../../../models'
import { wrapInfra } from '@core/utils'
import { Project } from '@infra/sequelize/projections'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../lister/requêtes/mapToFindOptions'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'

const { Project: ProjectModel } = models

export const getProjetsListePourDGEC = ({
  listeColonnes,
  filtres,
}: {
  listeColonnes: string[]
  filtres?: FiltreListeProjets
}) => {
  return wrapInfra(
    ProjectModel.findAll({
      ...(filtres && mapToFindOptions(filtres)),
      include: [
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          attributes: ['dateEnvoi', 'dateConstitution'],
        },
      ],
    })
  ).map((projets: Project[]) =>
    projets.map((projet: Project) =>
      listeColonnes.reduce(
        (liste, colonne) => ({
          ...liste,
          [colonne]:
            projet[colonne] ||
            (projet['details'] && projet['details'][colonne]) ||
            (projet['garantiesFinancières'] &&
              projet['garantiesFinancières'][colonne] &&
              new Date(projet['garantiesFinancières'][colonne]).toLocaleDateString()),
        }),
        {}
      )
    )
  )
}
