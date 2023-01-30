import models from '../../../models'
import { wrapInfra } from '@core/utils'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../lister/requêtes/mapToFindOptions'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { Colonne } from './donnéesProjetParCatégorie'
import { Op } from 'sequelize'
import { User } from '@entities'

const { Project: ProjectModel, UserDreal: UserDrealModel } = models

export const getProjetsListePourDREAL = ({
  listeColonnes,
  filtres,
  user,
}: {
  listeColonnes: Colonne[]
  filtres?: FiltreListeProjets
  user: User
}) => {
  const attributes = listeColonnes
    .filter((c): c is Colonne & { details: undefined } => c.details !== true)
    .map((c) => [c.champ, c.intitulé])
  const findOptions = filtres && mapToFindOptions(filtres)

  return wrapInfra(
    UserDrealModel.findOne({ where: { userId: user.id }, attributes: ['dreal'] })
  ).andThen((régionDreal: any) =>
    wrapInfra(
      ProjectModel.findAll({
        where: {
          ...findOptions?.where,
          notifiedOn: { [Op.gt]: 0 },
          regionProjet: {
            [Op.substring]: régionDreal.dreal,
          },
        },
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
  )
}
