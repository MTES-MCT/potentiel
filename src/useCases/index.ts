import { eventStore, fileRepo, sendNotification, projectRepo } from '@config'
import { projectRepo as OldProjectRepo, userRepo } from '@dataAccess'
import makeGetUserProject from './getUserProject'
import makeListMissingOwnerProjects from './listMissingOwnerProjects'
import makeRequestModification from './requestModification'
import makeShouldUserAccessProject from './shouldUserAccessProject'

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

const useCases = Object.freeze({
  sendNotification,
  requestModification,
  listMissingOwnerProjects,
  getUserProject,
  shouldUserAccessProject,
})

export default useCases
export {
  sendNotification,
  requestModification,
  listMissingOwnerProjects,
  getUserProject,
  shouldUserAccessProject,
}
