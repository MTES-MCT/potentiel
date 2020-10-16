import { handleProjectNotificationDateSet } from '../../modules/project/eventHandlers/handleProjectNotificationDateSet'
import { ProjectNotificationDateSet } from '../../modules/project/events'
import { eventStore } from '../eventStore.config'
import { appelOffreRepo, projectRepo } from '../repos.config'

eventStore.subscribe(
  ProjectNotificationDateSet.type,
  handleProjectNotificationDateSet({
    eventBus: eventStore,
    findProjectById: projectRepo.findById,
    getFamille: appelOffreRepo.getFamille,
  })
)
