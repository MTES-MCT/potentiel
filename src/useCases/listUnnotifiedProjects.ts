import { Project, AppelOffre, Periode } from '../entities'
import { Pagination, PaginatedList } from '../types'
import { ProjectRepo, AppelOffreRepo } from '../dataAccess'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  appelOffreRepo: AppelOffreRepo
}

interface CallUseCaseProps {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  pagination: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés'
}

type UseCaseReturnType = {
  appelsOffre: Array<AppelOffre>
  projects: PaginatedList<Project>
  projectsInPeriodCount: number
  selectedAppelOffreId: AppelOffre['id']
  selectedPeriodeId: Periode['id']
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
} | null

export default function makeListUnnotifiedProjects({
  projectRepo,
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

    // Get all appels offres that have at least one unnotified project
    result.existingAppelsOffres = await projectRepo.findExistingAppelsOffres({
      notifiedOn: 0, // (only unnotified projects)
    })

    // Not a single unnotified project, stop here
    if (!result.existingAppelsOffres.length) return null

    // Retained appel offre is either the one provided or the first of the existing ones
    result.selectedAppelOffreId = appelOffreId || result.existingAppelsOffres[0]

    result.appelsOffre = await appelOffreRepo.findAll()
    const appelOffre: AppelOffre = result.appelsOffre.find(
      (appelOffre) => appelOffre.id === result.selectedAppelOffreId
    )

    if (!appelOffre) return null

    // Get all periodes for this appels d'offre which have an unnotified project
    result.existingPeriodes = (
      await projectRepo.findExistingPeriodesForAppelOffre(
        result.selectedAppelOffreId,
        {
          notifiedOn: 0,
        }
      )
    ).filter((periodeId) => {
      // Only include periodes for which we can generate a certificate
      // The reverse means it's a period that isn't in our scope
      const periode = appelOffre.periodes.find(
        (periode) => periode.id === periodeId
      )

      return periode && !!periode.canGenerateCertificate
    })

    // Not a single unnotified project for which the admin can notify, stop here
    if (!result.existingPeriodes.length) return null

    // Retained periode is either the one provided (if it's in the list) or the first of the existing ones
    result.selectedPeriodeId =
      (periodeId && result.existingPeriodes.includes(periodeId) && periodeId) ||
      result.existingPeriodes[0]

    // Count all projects for this appelOffre and periode
    result.projectsInPeriodCount = (
      await projectRepo.findAll(
        {
          notifiedOn: 0,
          appelOffreId: result.selectedAppelOffreId,
          periodeId: result.selectedPeriodeId,
        },
        {
          page: 0,
          pageSize: 1,
        }
      )
    ).itemCount

    // Return all projects for this appelOffre, periode and search/filter params
    const query: any = {
      notifiedOn: 0,
      appelOffreId: result.selectedAppelOffreId,
      periodeId: result.selectedPeriodeId,
    }

    if (recherche) query.recherche = recherche

    if (classement) {
      if (classement === 'classés') query.classe = 'Classé'
      if (classement === 'éliminés') query.classe = 'Eliminé'
    }

    result.projects = await projectRepo.findAll(query, pagination)

    return result as UseCaseReturnType
  }
}
