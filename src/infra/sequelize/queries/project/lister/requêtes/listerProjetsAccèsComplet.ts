import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ListerProjets } from '@modules/project/queries'
import { models } from '../../../../models'
import { makePaginatedList, paginate } from '../../../../../../helpers/paginate'
import { mapToFindOptions } from '../../helpers/mapToFindOptions'
import { Op } from 'sequelize'
import { userIsNot } from '@modules/users'

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

export const listerProjetsAccèsComplet: ListerProjets = async ({ pagination, filtres, user }) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  const résultat = await models.Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      ...(userIsNot(['admin', 'dgec-validateur'])(user) && { notifiedOn: { [Op.gt]: 0 } }),
    },
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
