import models from '../../../models'
import { wrapInfra } from '@core/utils'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../lister/requêtes/mapToFindOptions'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { Colonne } from './donnéesProjetParCatégorie'

const { Project: ProjectModel } = models

export const getProjetsListePourDGEC = ({
  listeColonnes,
  filtres,
}: {
  listeColonnes: Colonne[]
  filtres?: FiltreListeProjets
}) => {
  const attributes = listeColonnes
    .filter((c): c is Colonne & { details: undefined } => c.details !== true)
    .map((c) => [c.champ, c.intitulé])
  const findOptions = filtres && mapToFindOptions(filtres)

  return wrapInfra(
    ProjectModel.findAll({
      where: findOptions?.where,
      include: [
        ...(findOptions ? findOptions.include : []),
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          attributes: [],
        },
      ],
      //@ts-ignore
      attributes: [...attributes, 'details'],
      raw: true,
    })
  ).map((projects) => {
    const listeColonnesDetail = listeColonnes
      .filter((c): c is Colonne & { details: true } => c.details === true)
      .map((c) => c.champ)

    return projects.map(({ details, ...project }) => ({
      ...project,
      ...(details && JSON.parse(JSON.stringify(details, listeColonnesDetail))),
    }))
  })
}
