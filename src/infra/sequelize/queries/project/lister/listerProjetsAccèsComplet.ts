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

export const listerProjetsAccèsComplet: ListerProjets<typeof attributes[number]> = async (
  pagination,
  filtres
) => {
  const résultat = await models.Project.findAndCountAll({
    ...(filtres && mapToFindOptions(filtres)),
    ...paginate(pagination),
    attributes: [...attributes.concat(), 'appelOffreId', 'periodeId', 'familleId'],
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
