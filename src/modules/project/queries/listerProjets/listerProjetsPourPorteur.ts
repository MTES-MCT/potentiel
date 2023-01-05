import { ProjectAppelOffre, User } from '@entities'
import { ProjectRepo } from '@dataAccess'
import { PaginatedList, Pagination } from '../../../../types'

import { construireQuery, FiltresConstruireQuery } from './helpers/construireQuery'
type Dépendances = {
  searchForUser: ProjectRepo['searchForUser']
  findAllForUser: ProjectRepo['findAllForUser']
}

type Filtres = {
  user: User
  pagination?: Pagination
  recherche?: string
} & FiltresConstruireQuery

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

export const makeListerProjetsPourPorteur =
  ({ findAllForUser, searchForUser }: Dépendances) =>
  async ({
    pagination,
    recherche,
    user,
    ...filtresPourQuery
  }: Filtres): Promise<PaginatedList<ProjectListItem>> => {
    const query = construireQuery(filtresPourQuery)

    const résultatRequête =
      recherche && recherche.length
        ? await searchForUser(user.id, recherche, query, pagination)
        : await findAllForUser(user.id, query, pagination)

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
