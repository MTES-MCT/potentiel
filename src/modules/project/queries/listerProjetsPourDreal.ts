import { AppelOffre, Periode, Famille, User, ProjectAppelOffre } from '@entities'
import { ProjectRepo, UserRepo, ProjectFilters } from '@dataAccess'
import { PaginatedList, Pagination } from '../../../types'

type Dépendances = {
  searchForRegions: ProjectRepo['searchForRegions']
  findAllForRegions: ProjectRepo['findAllForRegions']
  findDrealsForUser: UserRepo['findDrealsForUser']
}

type Filtres = {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés' | 'abandons'
  reclames?: 'réclamés' | 'non-réclamés'
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue'
}

type ProjectListItem = {
  id: string
  nomProjet: string
  potentielIdentifier: string
  communeProjet: string
  departementProjet: string
  regionProjet: string
  nomCandidat: string
  nomRepresentantLegal: string
  email: string
  puissance: number
  appelOffre?: {
    type: ProjectAppelOffre['type']
    unitePuissance: ProjectAppelOffre['unitePuissance']
    periode: ProjectAppelOffre['periode']
  }
  prixReference: number
  evaluationCarbone: number
  classe: 'Classé' | 'Eliminé'
  abandonedOn: number
  notifiedOn: number
  isFinancementParticipatif: boolean
  isInvestissementParticipatif: boolean
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee' | ''
  garantiesFinancières?: {
    id: string
    dateEnvoi?: Date
    statut: 'en attente' | 'à traiter' | 'validé'
    fichier?: {
      id: string
      filename: string
    }
  }
}

const construireQuery = (filtres) => {
  const query: ProjectFilters = {
    isNotified: true,
  }

  if (filtres.appelOffreId) {
    query.appelOffreId = filtres.appelOffreId

    if (filtres.periodeId) {
      query.periodeId = filtres.periodeId
    }

    if (filtres.familleId) {
      query.familleId = filtres.familleId
    }
  }

  switch (filtres.classement) {
    case 'classés':
      query.isClasse = true
      query.isAbandoned = false
      break
    case 'éliminés':
      query.isClasse = false
      query.isAbandoned = false
      break
    case 'abandons':
      query.isAbandoned = true
      break
  }

  if (filtres.reclames) {
    query.isClaimed = filtres.reclames === 'réclamés'
  }

  if (filtres.garantiesFinancieres) {
    query.garantiesFinancieres = filtres.garantiesFinancieres
  }

  return query
}

export const makeListerProjetsPourDreal =
  ({ searchForRegions, findAllForRegions, findDrealsForUser }: Dépendances) =>
  async ({
    user,
    pagination,
    recherche,
    ...filtresPourQuery
  }: Filtres): Promise<PaginatedList<ProjectListItem>> => {
    const query = construireQuery(filtresPourQuery)
    const regions = await findDrealsForUser(user.id)

    const résultatRequête =
      recherche && recherche.length
        ? await searchForRegions(regions, recherche, query, pagination)
        : await findAllForRegions(regions, query, pagination)

    return {
      ...résultatRequête,
      items: résultatRequête.items.map((projet) => ({
        id: projet.id,
        nomProjet: projet.nomProjet,
        potentielIdentifier: projet.potentielIdentifier,
        communeProjet: projet.communeProjet,
        departementProjet: projet.departementProjet,
        regionProjet: projet.regionProjet,
        nomCandidat: projet.nomCandidat,
        nomRepresentantLegal: projet.nomRepresentantLegal,
        email: projet.email,
        puissance: projet.puissance,
        prixReference: projet.prixReference,
        evaluationCarbone: projet.evaluationCarbone,
        classe: projet.classe,
        abandonedOn: projet.abandonedOn,
        notifiedOn: projet.notifiedOn,
        isFinancementParticipatif: projet.isFinancementParticipatif,
        isInvestissementParticipatif: projet.isInvestissementParticipatif,
        ...(projet.actionnariat && { actionnariat: projet.actionnariat }),
        ...(projet.appelOffre && {
          appelOffre: {
            type: projet.appelOffre.type,
            unitePuissance: projet.appelOffre.unitePuissance,
            periode: projet.appelOffre.periode,
          },
        }),
        ...(projet.garantiesFinancières && {
          garantiesFinancières: {
            id: projet.garantiesFinancières.id,
            statut: projet.garantiesFinancières.statut,
            ...(projet.garantiesFinancières.dateEnvoi && {
              dateEnvoi: projet.garantiesFinancières.dateEnvoi,
            }),
            ...(projet.garantiesFinancières.fichier && {
              fichier: {
                id: projet.garantiesFinancières.fichier.id,
                filename: projet.garantiesFinancières.fichier.filename,
              },
            }),
          },
        }),
      })),
    }
  }
