import { Project, AppelOffre, Periode, isNotifiedPeriode } from '@entities'
import { Pagination, PaginatedList } from '../types'
import { ProjectRepo, AppelOffreRepo, ProjectFilters } from '@dataAccess'

interface MakeUseCaseProps {
  findExistingAppelsOffres: ProjectRepo['findExistingAppelsOffres']
  findExistingPeriodesForAppelOffre: ProjectRepo['findExistingPeriodesForAppelOffre']
  countUnnotifiedProjects: ProjectRepo['countUnnotifiedProjects']
  findAllProjects: ProjectRepo['findAll']
  searchAllProjects: ProjectRepo['searchAll']
  appelOffreRepo: AppelOffreRepo
}

interface CallUseCaseProps {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  pagination: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés'
}

export type AppelOffreDTO = {
  id: AppelOffre['id']
  shortTitle: AppelOffre['shortTitle']
}

export type PeriodeDTO = {
  id: Periode['id']
  title: Periode['title']
}

type UseCaseReturnType = {
  projects: PaginatedList<Project>
  projectsInPeriodCount: number
  selectedAppelOffreId: AppelOffre['id']
  selectedPeriodeId: Periode['id']
  existingAppelsOffres: Array<AppelOffreDTO>
  existingPeriodes?: Array<PeriodeDTO>
} | null

export default function makeListUnnotifiedProjects({
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects,
  findAllProjects,
  searchAllProjects,
  appelOffreRepo,
}: MakeUseCaseProps) {
  return async function listUnnotifiedProjects({
    appelOffreId,
    periodeId,
    pagination,
    recherche,
    classement,
  }: CallUseCaseProps): Promise<UseCaseReturnType> {
    const result: any = {}

    const appelsOffre = await appelOffreRepo.findAll()

    // Get all appels offres that have at least one unnotified project
    result.existingAppelsOffres = (
      await findExistingAppelsOffres({
        isNotified: false,
      })
    ).map((appelOffreId) => ({
      id: appelOffreId,
      shortTitle: appelsOffre.find((item) => item.id === appelOffreId)?.shortTitle || appelOffreId,
    }))

    // Not a single unnotified project, stop here
    if (!result.existingAppelsOffres.length) return null

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
      result.selectedAppelOffreId = appelOffreId
      const selectedAppelOffre = appelsOffre.find(
        (appelOffre) => appelOffre.id === result.selectedAppelOffreId
      )
      if (!selectedAppelOffre) return null

      result.existingPeriodes = await getPeriodesWithNotifiableProjectsForAppelOffre(
        selectedAppelOffre
      )
    } else {
      // No appel offre given, look for one with a notifiable project
      for (const appelOffreItem of result.existingAppelsOffres) {
        const appelOffre = appelsOffre.find((appelOffre) => appelOffre.id === appelOffreItem.id)

        if (!appelOffre) continue
        result.selectedAppelOffreId = appelOffreItem.id
        result.existingPeriodes = await getPeriodesWithNotifiableProjectsForAppelOffre(appelOffre)

        if (result.existingPeriodes.length) break
      }
    }

    // Not a single unnotified project for which the admin can notify, stop here
    if (!result.existingPeriodes.length) return null

    // Retained periode is either the one provided (if it's in the list) or the first of the existing ones
    result.selectedPeriodeId =
      (periodeId &&
        result.existingPeriodes.map((item) => item.id).includes(periodeId) &&
        periodeId) ||
      result.existingPeriodes[0].id

    // Count all projects for this appelOffre and periode
    result.projectsInPeriodCount = await countUnnotifiedProjects(
      result.selectedAppelOffreId,
      result.selectedPeriodeId
    )

    // Return all projects for this appelOffre, periode and search/filter params
    const query: ProjectFilters = {
      isNotified: false,
      appelOffreId: result.selectedAppelOffreId,
      periodeId: result.selectedPeriodeId,
    }

    if (classement) {
      if (classement === 'classés') query.isClasse = true
      if (classement === 'éliminés') query.isClasse = false
    }

    result.projects = recherche
      ? await searchAllProjects(recherche, query, pagination)
      : await findAllProjects(query, pagination)

    return result as UseCaseReturnType
  }
}
