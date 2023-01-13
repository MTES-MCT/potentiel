import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ListerProjets } from '@modules/project'
import { models } from '../../../../models'
import { makePaginatedList, paginate } from '../../../../../../helpers/paginate'
import { mapToFindOptions } from './mapToFindOptions'

const attributes = [
  'id',
  'appelOffreId',
  'periodeId',
  'familleId',
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
]

export const listerProjetsPourPorteur: ListerProjets = async ({
  pagination,
  filtres,
  user: { id: userId },
}) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  const résultat = await models.Project.findAndCountAll({
    subQuery: false,
    where: {
      ...findOptions?.where,
      '$users.userId$': userId,
    },
    include: [
      ...(findOptions?.include ? findOptions.include : []),
      {
        model: models.UserProjects,
        as: 'users',
        attributes: [],
      },
    ],
    ...paginate(pagination),
    attributes,
  })

  const projetsAvecAppelOffre = résultat.rows.reduce((prev, current) => {
    const { appelOffreId, periodeId, familleId, ...projet } = current.get()
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
