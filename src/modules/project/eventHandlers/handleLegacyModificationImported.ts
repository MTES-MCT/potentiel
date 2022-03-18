import { Project } from '..'
import { TransactionalRepository, UniqueEntityID } from '@core/domain'
import { LegacyModificationImported } from '../../modificationRequest'

export const handleLegacyModificationImported =
  (deps: { projectRepo: TransactionalRepository<Project> }) =>
  async (event: LegacyModificationImported) => {
    const { projectRepo } = deps
    const { projectId, modifications } = event.payload

    const modificationsDescDate = modifications.sort((a, b) => b.modifiedOn - a.modifiedOn)

    let delayApplied = false
    let abandonApplied = false
    for (const modification of modificationsDescDate) {
      switch (modification.type) {
        case 'delai':
          if (delayApplied) continue
          if (modification.accepted) {
            await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
              return project.setCompletionDueDate(modification.nouvelleDateLimiteAchevement)
            })
            delayApplied = true
          }
          break
        case 'abandon':
          if (abandonApplied) continue
          if (modification.accepted) {
            await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
              return project.abandonLegacy(modification.modifiedOn)
            })
            abandonApplied = true
          }
          break
        default:
          break
      }
    }
  }
