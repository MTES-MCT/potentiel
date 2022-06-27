import { Project } from '..'
import { TransactionalRepository, UniqueEntityID } from '@core/domain'
import { LegacyModificationImported } from '../../modificationRequest'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { ProjectionEnEchec } from '@modules/shared'
import { err } from '@core/utils'

type HandleLegacyModificationImportedDependencies = {
  projectRepo: TransactionalRepository<Project>
  getProjectAppelOffre: GetProjectAppelOffre
}

export const handleLegacyModificationImported =
  ({ projectRepo, getProjectAppelOffre }: HandleLegacyModificationImportedDependencies) =>
  async (event: LegacyModificationImported) => {
    const { projectId, modifications } = event.payload

    const modificationsDescDate = modifications.sort((a, b) => b.modifiedOn - a.modifiedOn)

    let delayApplied = false
    let abandonApplied = false
    for (const modification of modificationsDescDate) {
      switch (modification.type) {
        case 'delai':
          if (delayApplied) continue
          if (modification.status === 'acceptée') {
            await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
              const { appelOffreId, periodeId, familleId } = project
              const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
              if (!appelOffre) {
                return err(
                  new ProjectionEnEchec(
                    `Impossible d'appliquer la demande de modification de délai`,
                    { nomProjection: 'handleLegacyModificationImported', evenement: event }
                  )
                )
              }

              return project.setCompletionDueDate({
                appelOffre,
                completionDueOn: modification.nouvelleDateLimiteAchevement,
              })
            })
            delayApplied = true
          }
          break
        case 'abandon':
          if (abandonApplied) continue
          if (modification.status === 'acceptée') {
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
