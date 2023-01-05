import { ProjectAppelOffre, User } from '@entities'
import { ProjectRepo } from '@dataAccess'
import { PaginatedList, Pagination } from '../../../../types'

import { construireQuery, FiltresConstruireQuery } from './helpers/construireQuery'
type Dépendances = {
  searchAll: ProjectRepo['searchAll']
  findAll: ProjectRepo['findAll']
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
  classe: 'Classé' | 'Eliminé'
  abandonedOn: number
  notifiedOn: number
}

export const makeListerProjetsPourCaisseDesDépôts =
  ({ searchAll, findAll }: Dépendances) =>
  async ({
    pagination,
    recherche,
    ...filtresPourQuery
  }: Filtres): Promise<PaginatedList<ProjectListItem>> => {
    const query = construireQuery(filtresPourQuery)

    const résultatRequête =
      recherche && recherche.length
        ? await searchAll(recherche, query, pagination)
        : await findAll(query, pagination)

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
        classe: projet.classe,
        abandonedOn: projet.abandonedOn,
        notifiedOn: projet.notifiedOn,
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
