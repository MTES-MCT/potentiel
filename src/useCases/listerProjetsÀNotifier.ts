import { Project, AppelOffre, Periode, isNotifiedPeriode, User } from '@entities'
import { Pagination, PaginatedList } from '../types'
import { ProjectRepo, AppelOffreRepo } from '@dataAccess'
import { FiltreListeProjets, ListerProjets } from '@modules/project'

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

export type AppelOffreDTO = {
  id: AppelOffre['id']
  shortTitle: AppelOffre['shortTitle']
}

export type PeriodeDTO = {
  id: Periode['id']
  title: Periode['title']
}

type Résultat = {
  projects: PaginatedList<Project>
  projectsInPeriodCount: number
  selectedAppelOffreId: AppelOffre['id']
  selectedPeriodeId: Periode['id']
  existingAppelsOffres: Array<AppelOffreDTO>
  existingPeriodes?: Array<PeriodeDTO>
} | null

export const makeListerProjetsÀNotifier =
  ({
    findExistingAppelsOffres,
    findExistingPeriodesForAppelOffre,
    countUnnotifiedProjects,
    listerProjets,
    appelOffreRepo,
  }: Dépendances) =>
  async ({
    appelOffreId,
    periodeId,
    pagination,
    recherche,
    classement,
    user,
  }: Commande): Promise<Résultat> => {
    const résultat: any = {}

    const appelsOffres = await appelOffreRepo.findAll()

    // Get all appels offres that have at least one unnotified project
    résultat.existingAppelsOffres = (
      await findExistingAppelsOffres({
        isNotified: false,
      })
    ).map((appelOffreId) => ({
      id: appelOffreId,
      shortTitle: appelsOffres.find((item) => item.id === appelOffreId)?.shortTitle || appelOffreId,
    }))

    // Not a single unnotified project, stop here
    if (!résultat.existingAppelsOffres.length) return null

    const getPeriodesWithNotifiableProjectsForAppelOffre = async (_appelOffre: AppelOffre) =>
      (
        await findExistingPeriodesForAppelOffre(_appelOffre.id, {
          isNotified: false,
        })
      )
        .map((periodeId) => {
          // Only include periodes for which we can generate a certificate
          // The reverse means it's a period that isn't in our scope
          const periode = _appelOffre.periodes.find((periode) => periode.id === periodeId)

          return (
            !!periode &&
            !!isNotifiedPeriode(periode) && {
              id: periodeId,
              title: periode.title,
            }
          )
        })
        .filter((item) => !!item)

    if (appelOffreId) {
      résultat.selectedAppelOffreId = appelOffreId
      const selectedAppelOffre = appelsOffres.find(
        (appelOffre) => appelOffre.id === résultat.selectedAppelOffreId
      )
      if (!selectedAppelOffre) return null

      résultat.existingPeriodes = await getPeriodesWithNotifiableProjectsForAppelOffre(
        selectedAppelOffre
      )
    } else {
      // No appel offre given, look for one with a notifiable project
      for (const appelOffreItem of résultat.existingAppelsOffres) {
        const appelOffre = appelsOffres.find((appelOffre) => appelOffre.id === appelOffreItem.id)

        if (!appelOffre) continue
        résultat.selectedAppelOffreId = appelOffreItem.id
        résultat.existingPeriodes = await getPeriodesWithNotifiableProjectsForAppelOffre(appelOffre)

        if (résultat.existingPeriodes.length) break
      }
    }

    // Not a single unnotified project for which the admin can notify, stop here
    if (!résultat.existingPeriodes.length) return null

    // Retained periode is either the one provided (if it's in the list) or the first of the existing ones
    résultat.selectedPeriodeId =
      (periodeId &&
        résultat.existingPeriodes.map((item) => item.id).includes(periodeId) &&
        periodeId) ||
      résultat.existingPeriodes[0].id

    // Count all projects for this appelOffre and periode
    résultat.projectsInPeriodCount = await countUnnotifiedProjects(
      résultat.selectedAppelOffreId,
      résultat.selectedPeriodeId
    )

    // Return all projects for this appelOffre, periode and search/filter params
    const filtres: FiltreListeProjets = {
      recherche,
      classement,
      appelOffre: {
        appelOffreId: résultat.selectedAppelOffreId,
        periodeId: résultat.selectedPeriodeId,
      },
      étatNotification: 'non-notifiés',
    }

    résultat.projects = await listerProjets({ user, filtres, pagination })

    return résultat as Résultat
  }
