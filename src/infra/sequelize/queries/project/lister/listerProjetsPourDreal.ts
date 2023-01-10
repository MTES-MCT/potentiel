import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ListerProjets } from '@modules/project'
import { models } from '../../../models'
import { makePaginatedList, paginate } from '../../../../../helpers/paginate'
import { mapToFindOptions } from './mapToFindOptions'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { Op, literal } from 'sequelize'

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
  'classe',
  'abandonedOn',
  'notifiedOn',
  'isFinancementParticipatif',
  'isInvestissementParticipatif',
  'actionnariat',
] as const

export const listerProjetsPourDreal: ListerProjets<
  typeof attributes[number] | 'garantiesFinancières'
> = async (pagination, filtres, userId) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  const résultat = await models.Project.findAndCountAll({
    where: {
      ...findOptions?.where,
      regionProjet: {
        [Op.substring]: literal(`(SELECT "dreal" FROM "userDreals" where "userId" = '${userId}')`),
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

// import { User, ProjectAppelOffre } from '@entities'
// import { ProjectRepo, UserRepo } from '@dataAccess'
// import { PaginatedList, Pagination } from '../../../../../types'
// import {
//   construireQuery,
//   FiltresConstruireQuery,
// } from '../../../../../modules/project/queries/listerProjets/helpers/construireQuery'
// type Dépendances = {
//   searchForRegions: ProjectRepo['searchForRegions']
//   findAllForRegions: ProjectRepo['findAllForRegions']
//   findDrealsForUser: UserRepo['findDrealsForUser']
// }

// type Filtres = {
//   user: User
//   pagination?: Pagination
//   recherche?: string
// } & FiltresConstruireQuery

// type ProjectListItem = {
// }

// export const makeListerProjetsPourDreal =
//   ({ searchForRegions, findAllForRegions, findDrealsForUser }: Dépendances) =>
//   async ({
//     user,
//     pagination,
//     recherche,
//     ...filtresPourQuery
//   }: Filtres): Promise<PaginatedList<ProjectListItem>> => {
//     const query = construireQuery(filtresPourQuery)
//     const regions = await findDrealsForUser(user.id)

//     const résultatRequête =
//       recherche && recherche.length
//         ? await searchForRegions(regions, recherche, query, pagination)
//         : await findAllForRegions(regions, query, pagination)

//     return {
//       ...résultatRequête,
//       items: résultatRequête.items.map((projet) => ({
//         id: projet.id,
//         nomProjet: projet.nomProjet,
//         potentielIdentifier: projet.potentielIdentifier,
//         communeProjet: projet.communeProjet,
//         departementProjet: projet.departementProjet,
//         regionProjet: projet.regionProjet,
//         nomCandidat: projet.nomCandidat,
//         nomRepresentantLegal: projet.nomRepresentantLegal,
//         email: projet.email,
//         puissance: projet.puissance,
//         prixReference: projet.prixReference,
//         evaluationCarbone: projet.evaluationCarbone,
//         classe: projet.classe,
//         abandonedOn: projet.abandonedOn,
//         notifiedOn: projet.notifiedOn,
//         isFinancementParticipatif: projet.isFinancementParticipatif,
//         isInvestissementParticipatif: projet.isInvestissementParticipatif,
//         ...(projet.actionnariat && { actionnariat: projet.actionnariat }),
//         ...(projet.appelOffre && {
//           appelOffre: {
//             type: projet.appelOffre.type,
//             unitePuissance: projet.appelOffre.unitePuissance,
//             periode: projet.appelOffre.periode,
//           },
//         }),
//         ...(projet.garantiesFinancières && {
//           garantiesFinancières: {
//             id: projet.garantiesFinancières.id,
//             statut: projet.garantiesFinancières.statut,
//             ...(projet.garantiesFinancières.dateEnvoi && {
//               dateEnvoi: projet.garantiesFinancières.dateEnvoi,
//             }),
//             ...(projet.garantiesFinancières.fichier && {
//               fichier: {
//                 id: projet.garantiesFinancières.fichier.id,
//                 filename: projet.garantiesFinancières.fichier.filename,
//               },
//             }),
//           },
//         }),
//       })),
//     }
//   }
