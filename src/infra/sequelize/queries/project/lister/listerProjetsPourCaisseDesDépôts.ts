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
  'classe',
  'abandonedOn',
  'notifiedOn',
] as const

export const listerProjetsPourCaisseDesDépôts: ListerProjets<typeof attributes[number]> = async (
  pagination,
  filtres
) => {
  const résultat = await models.Project.findAndCountAll({
    ...(filtres && mapToFindOptions(filtres)),
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
