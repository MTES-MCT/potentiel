import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ListerProjets } from '@modules/project'
import { models } from '../../../../models'
import { makePaginatedList, paginate } from '../../../../../../helpers/paginate'
import { mapToFindOptions } from './mapToFindOptions'
import { GarantiesFinancières } from '../../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { Op } from 'sequelize'

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
  'classe',
  'abandonedOn',
  'notifiedOn',
  'isFinancementParticipatif',
  'isInvestissementParticipatif',
  'actionnariat',
]

export const listerProjetsPourDreal: ListerProjets = async ({
  pagination,
  filtres,
  user: { id: userId },
}) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  const régionDreal = await models.UserDreal.findOne({ where: { userId }, attributes: ['dreal'] })

  const résultat = await models.Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      regionProjet: {
        [Op.substring]: régionDreal.dreal,
      },
    },
    include: [
      ...(findOptions?.include ? findOptions.include : []),
      {
        model: GarantiesFinancières,
        as: 'garantiesFinancières',
        include: [{ model: models.File, as: 'fichier' }],
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
