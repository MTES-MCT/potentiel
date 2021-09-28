import { eventStore, fileRepo, getProjectAppelOffreId, sendNotification } from '../config'
import { appelOffreRepo, projectRepo, userRepo } from '../dataAccess'
import makeGetUserProject from './getUserProject'
import makeImportProjects from './importProjects'
import makeListProjects from './listProjects'
import makeListUnnotifiedProjects from './listUnnotifiedProjects'
import makeRelanceGarantiesFinancieres from './relanceGarantiesFinancieres'
import makeRequestModification from './requestModification'
import makeShouldUserAccessProject from './shouldUserAccessProject'

const importProjects = makeImportProjects({
  eventBus: eventStore,
  findOneProject: projectRepo.findOne,
  saveProject: projectRepo.save,
  removeProject: projectRepo.remove,
  addProjectToUserWithEmail: userRepo.addProjectToUserWithEmail,
  appelOffreRepo,
})

const listProjects = makeListProjects({
  searchForRegions: projectRepo.searchForRegions,
  findAllForRegions: projectRepo.findAllForRegions,
  searchForUser: projectRepo.searchForUser,
  findAllForUser: projectRepo.findAllForUser,
  searchAll: projectRepo.searchAll,
  findAll: projectRepo.findAll,
  findExistingAppelsOffres: projectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: projectRepo.findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre: projectRepo.findExistingFamillesForAppelOffre,
  findDrealsForUser: userRepo.findDrealsForUser,
})
const listUnnotifiedProjects = makeListUnnotifiedProjects({
  findAllProjects: projectRepo.findAll,
  findExistingAppelsOffres: projectRepo.findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre: projectRepo.findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects: projectRepo.countUnnotifiedProjects,
  searchAllProjects: projectRepo.searchAll,
  appelOffreRepo,
})

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  findProjectById: projectRepo.findById,
})

const requestModification = makeRequestModification({
  fileRepo,
  eventBus: eventStore,
  shouldUserAccessProject,
  getProjectAppelOffreId,
})

const getUserProject = makeGetUserProject({
  findProjectById: projectRepo.findById,
  shouldUserAccessProject,
})

const relanceGarantiesFinancieres = makeRelanceGarantiesFinancieres({
  eventBus: eventStore,
  findProjectsWithGarantiesFinancieresPendingBefore:
    projectRepo.findProjectsWithGarantiesFinancieresPendingBefore,
  getUsersForProject: projectRepo.getUsers,
  saveProject: projectRepo.save,
  sendNotification,
})

const useCases = Object.freeze({
  importProjects,
  listProjects,
  sendNotification,
  requestModification,
  listUnnotifiedProjects,
  getUserProject,
  shouldUserAccessProject,
  relanceGarantiesFinancieres,
})

export default useCases
export {
  importProjects,
  listProjects,
  sendNotification,
  requestModification,
  listUnnotifiedProjects,
  getUserProject,
  shouldUserAccessProject,
  relanceGarantiesFinancieres,
}
