import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ListerProjets } from '@modules/project'
import { models } from '../../../models'
import { makePaginatedList, paginate } from '../../../../../helpers/paginate'
import { mapToFindOptions } from './mapToFindOptions'

const attributes = [
  'id',
  'nomProjet',
  'potentielIdentifier',
  'communeProjet',
  'departementProjet',
  'regionProjet',
  'nomCandidat',
  'nomRepresentantLegal',
  'email',
  'puissance',
  'prixReference',
  'evaluationCarbone',
  'classe',
  'abandonedOn',
  'notifiedOn',
  'isFinancementParticipatif',
  'isInvestissementParticipatif',
  'actionnariat',
] as const

export const listerProjetsPourPorteur: ListerProjets<typeof attributes[number]> = async (
  pagination,
  filtres,
  userId
) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  const résultat = await models.Project.findAndCountAll({
    where: {
      ...findOptions?.where,
    },
    include: [
      ...(findOptions?.include ? findOptions.include : []),
      ...(userId
        ? [
            {
              model: models.UserProjects,
              as: 'users',
              where: {
                userId: userId,
              },
            },
          ]
        : []),
    ],
    ...paginate(pagination),
    attributes: [...attributes.concat(), 'appelOffreId', 'periodeId', 'familleId'],
    raw: true,
  })

  const projetsAvecAppelOffre = résultat.rows.reduce((prev, current) => {
    const { appelOffreId, periodeId, familleId, ...projet } = current
    const appelOffre = getProjectAppelOffre({
      appelOffreId,
      periodeId,
      familleId,
    })

    return [
      ...prev,
      {
        ...projet,
        ...(appelOffre && {
          appelOffre: {
            type: appelOffre?.type,
            unitePuissance: appelOffre?.unitePuissance,
            periode: appelOffre?.periode,
          },
        }),
      },
    ]
  }, [])

  return makePaginatedList(projetsAvecAppelOffre, résultat.count, pagination)
}
