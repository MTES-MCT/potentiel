import { FindProjectByIdentifiers } from '..'
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { ResultAsync } from '../../../core/utils'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError } from '../../shared'
import { ProjectImported, ProjectRawDataImported } from '../events'
import { Project } from '../Project'

export const handleProjectRawDataImported = (deps: {
  findProjectByIdentifiers: FindProjectByIdentifiers
  projectRepo: TransactionalRepository<Project>
  eventBus: EventBus
}) => async (event: ProjectRawDataImported): Promise<ResultAsync<null, InfraNotAvailableError>> => {
  const { findProjectByIdentifiers, projectRepo, eventBus } = deps

  const { data, importId } = event.payload
  const { appelOffreId, periodeId, familleId, numeroCRE } = data

  // PAD: There is a concurrency risk here:
  // findProjectByIdentifiers might return null AFTER a ProjectImported has been emitted for the same project (because of eventual consistency)
  // The effect would be to have two projects with the same identifiers
  // To avoid this, we could use the appelOffreId/periodeId/familleId/numeroCRE as the aggregate id for projects and open a transaction
  // Or, avoid doing multiple imports simultaneously (recommended for now)
  return findProjectByIdentifiers({ appelOffreId, periodeId, familleId, numeroCRE }).andThen(
    (projectIdOrNull) => {
      if (projectIdOrNull === null) {
        return eventBus.publish(
          new ProjectImported({
            payload: {
              projectId: new UniqueEntityID().toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              importId,
              data,
            },
          })
        )
      }

      return projectRepo.transaction(new UniqueEntityID(projectIdOrNull), (project) => {
        return project.reimport({ data, importId })
      })
    }
  )
}
