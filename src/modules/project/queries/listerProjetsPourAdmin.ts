import { AppelOffre, Periode, Famille, User, ProjectAppelOffre } from '@entities'
import { ProjectRepo, ProjectFilters } from '@dataAccess'
import { Pagination, PaginatedList } from '../../../types'

type Dépendances = {
  searchAll: ProjectRepo['searchAll']
  findAll: ProjectRepo['findAll']
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
}

export const makeListerProjetsPourAdmin =
  ({ searchAll, findAll }: Dépendances) =>
  async ({
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  }: Filtres): Promise<PaginatedList<ProjectListItem>> => {
    const filtres: ProjectFilters = {
      isNotified: true,
    }

    if (appelOffreId) {
      filtres.appelOffreId = appelOffreId

      if (periodeId) {
        filtres.periodeId = periodeId
      }

      if (familleId) {
        filtres.familleId = familleId
      }
    }

    switch (classement) {
      case 'classés':
        filtres.isClasse = true
        filtres.isAbandoned = false
        break
      case 'éliminés':
        filtres.isClasse = false
        filtres.isAbandoned = false
        break
      case 'abandons':
        filtres.isAbandoned = true
        break
    }

    if (reclames) {
      filtres.isClaimed = reclames === 'réclamés'
    }

    if (garantiesFinancieres) {
      filtres.garantiesFinancieres = garantiesFinancieres
    }

    const résultatRequête =
      recherche && recherche.length
        ? await searchAll(recherche, filtres, pagination)
        : await findAll(filtres, pagination)

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
      })),
    }
  }
