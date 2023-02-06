import { eventStore, fileRepo, sendNotification, projectRepo, listerProjets } from '@config'
import { appelOffreRepo, projectRepo as OldProjectRepo, userRepo } from '@dataAccess'
import makeGetUserProject from './getUserProject'
import { makeListerProjetsÀNotifier } from './listerProjetsÀNotifier'
import makeListMissingOwnerProjects from './listMissingOwnerProjects'
import makeRequestModification from './requestModification'
import makeShouldUserAccessProject from './shouldUserAccessProject'

const listerProjetsÀNotifier = makeListerProjetsÀNotifier({
  findExistingAppelsOffres: OldProjectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: OldProjectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: OldProjectRepo.countUnnotifiedProjects,
  appelOffreRepo,
  listerProjets: listerProjets,
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

const useCases = Object.freeze({
  sendNotification,
  requestModification,
  listUnnotifiedProjects: listerProjetsÀNotifier,
  listMissingOwnerProjects,
  getUserProject,
  shouldUserAccessProject,
})

export default useCases
export {
  sendNotification,
  requestModification,
  listerProjetsÀNotifier,
  listMissingOwnerProjects,
  getUserProject,
  shouldUserAccessProject,
}
