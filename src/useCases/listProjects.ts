import { Project, AppelOffre, Periode, Famille, User, DREAL } from '../entities'
import { ProjectRepo, UserRepo } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import _ from 'lodash'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
}

interface CallUseCaseProps {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés'
  garantiesFinancieres?: 'submitted' | 'notSubmitted'
}

interface UseCaseReturnType {
  projects: PaginatedList<Project>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

export default function makeListProjects({
  projectRepo,
  userRepo,
}: MakeUseCaseProps) {
  return async function listProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    garantiesFinancieres,
  }: CallUseCaseProps): Promise<UseCaseReturnType> {
    const query: any = {
      notifiedOn: -1, // -1 means !== 0 (only notified projects)
    }

    if (user.role === 'dreal') {
      query.regionProjet = await userRepo.findDrealsForUser(user.id)
    }

    if (user.role === 'porteur-projet') {
      query.userId = user.id
    }

    if (appelOffreId) {
      query.appelOffreId = appelOffreId

      if (periodeId) {
        query.periodeId = periodeId
      }

      if (familleId) {
        query.familleId = familleId
      }
    }

    if (recherche) query.recherche = recherche

    if (classement) {
      if (classement === 'classés') query.classe = 'Classé'
      if (classement === 'éliminés') query.classe = 'Eliminé'
    }

    if (garantiesFinancieres) {
      if (garantiesFinancieres === 'notSubmitted')
        query.garantiesFinancieresSubmittedOn = 0
      if (garantiesFinancieres === 'submitted')
        query.garantiesFinancieresSubmittedOn = -1
    }

    const result: any = {}

    const genericQuery = _.pick(query, ['notifiedOn', 'regionProjet', 'userId'])
    result.existingAppelsOffres = await projectRepo.findExistingAppelsOffres(
      genericQuery
    )

    if (appelOffreId) {
      result.existingPeriodes = await projectRepo.findExistingPeriodesForAppelOffre(
        appelOffreId,
        genericQuery
      )
      result.existingFamilles = await projectRepo.findExistingFamillesForAppelOffre(
        appelOffreId,
        genericQuery
      )
    }

    result.projects = await projectRepo.findAll(query, pagination)

    return result as UseCaseReturnType
  }
}
