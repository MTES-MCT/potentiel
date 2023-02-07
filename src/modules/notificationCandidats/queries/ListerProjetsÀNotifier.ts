import { AppelOffreRepo, ProjectRepo } from '@dataAccess'
import { AppelOffre, Periode, Project, User } from '@entities'
import { ListerProjets } from '@modules/project'
import { PaginatedList, Pagination } from '../../../types'

export const PermissionListerProjetsÀNotifier = {
  nom: 'lister-projets-à-notifier',
  description: 'Lister les projets à notifier',
}

export type AppelOffreDTO = {
  id: AppelOffre['id']
  shortTitle: AppelOffre['shortTitle']
}

export type PeriodeDTO = {
  id: Periode['id']
  title: Periode['title']
}

type Dépendances = {
  findExistingAppelsOffres: ProjectRepo['findExistingAppelsOffres']
  findExistingPeriodesForAppelOffre: ProjectRepo['findExistingPeriodesForAppelOffre']
  countUnnotifiedProjects: ProjectRepo['countUnnotifiedProjects']
  appelOffreRepo: AppelOffreRepo
  listerProjets: ListerProjets
}

type Commande = {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  pagination: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés'
  user: User
}

type Résultat = {
  projects: PaginatedList<Project>
  projectsInPeriodCount: number
  selectedAppelOffreId: AppelOffre['id']
  selectedPeriodeId: Periode['id']
  existingAppelsOffres: Array<AppelOffreDTO>
  existingPeriodes?: Array<PeriodeDTO>
} | null

export type MakeListerProjetsÀNotifier = (
  dépendances: Dépendances
) => (commande: Commande) => Promise<Résultat>
