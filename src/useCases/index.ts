import { eventStore, fileRepo, sendNotification, projectRepo } from '@config'
import { appelOffreRepo, projectRepo as OldProjectRepo, userRepo } from '@dataAccess'
import makeGetUserProject from './getUserProject'
import makeListUnnotifiedProjects from './listUnnotifiedProjects'
import makeListMissingOwnerProjects from './listMissingOwnerProjects'
import makeRelanceGarantiesFinancieres from './relanceGarantiesFinancieres'
import makeRequestModification from './requestModification'
import makeShouldUserAccessProject from './shouldUserAccessProject'

const listUnnotifiedProjects = makeListUnnotifiedProjects({
  findAllProjects: OldProjectRepo.findAll,
  findExistingAppelsOffres: OldProjectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: OldProjectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: OldProjectRepo.countUnnotifiedProjects,
  searchAllProjects: OldProjectRepo.searchAll,
  appelOffreRepo,
})
const listMissingOwnerProjects = makeListMissingOwnerProjects({
  searchAllMissingOwner: OldProjectRepo.searchAllMissingOwner,
  findExistingAppelsOffres: OldProjectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: OldProjectRepo.findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre: OldProjectRepo.findExistingFamillesForAppelOffre,
})

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  findProjectById: OldProjectRepo.findById,
})

const requestModification = makeRequestModification({
  fileRepo,
  eventBus: eventStore,
  shouldUserAccessProject,
  projectRepo: projectRepo,
})

const getUserProject = makeGetUserProject({
  findProjectById: OldProjectRepo.findById,
  shouldUserAccessProject,
})

const relanceGarantiesFinancieres = makeRelanceGarantiesFinancieres({
  eventBus: eventStore,
  findProjectsWithGarantiesFinancieresPendingBefore:
    OldProjectRepo.findProjectsWithGarantiesFinancieresPendingBefore,
  getUsersForProject: OldProjectRepo.getUsers,
  saveProject: OldProjectRepo.save,
  sendNotification,
})

const useCases = Object.freeze({
  sendNotification,
  requestModification,
  listUnnotifiedProjects,
  listMissingOwnerProjects,
  getUserProject,
  shouldUserAccessProject,
  relanceGarantiesFinancieres,
})

export default useCases
export {
  sendNotification,
  requestModification,
  listUnnotifiedProjects,
  listMissingOwnerProjects,
  getUserProject,
  shouldUserAccessProject,
  relanceGarantiesFinancieres,
}
