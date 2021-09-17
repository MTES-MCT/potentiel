import { FindProjectByIdentifiers } from '..'
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { ok } from '../../../core/utils'
import { ProjectRawDataImported } from '../events'
import { Project } from '../Project'

export const handleProjectRawDataImported =
  (deps: {
    findProjectByIdentifiers: FindProjectByIdentifiers
    projectRepo: TransactionalRepository<Project>
  }) =>
  async (event: ProjectRawDataImported) => {
    const { findProjectByIdentifiers, projectRepo } = deps

    const { data, importId } = event.payload
    const { appelOffreId, periodeId, familleId, numeroCRE } = data

    // PAD: There is a concurrency risk here:
    // findProjectByIdentifiers might return null AFTER a ProjectImported has been emitted for the same project (because of eventual consistency)
    // The effect would be to have two projects with the same identifiers
    // To avoid this, we could use the appelOffreId/periodeId/familleId/numeroCRE as the aggregate id for projects and open a transaction
    // Or, avoid doing multiple imports simultaneously (recommended for now)
    const res = await findProjectByIdentifiers({
      appelOffreId,
      periodeId,
      familleId,
      numeroCRE,
    }).andThen((projectIdOrNull) => {
      if (projectIdOrNull === null) {
        return projectRepo.transaction(
          new UniqueEntityID(),
          (project) => {
            return project
              .import({ data, importId })
              .andThen((): ReturnType<typeof project.setNotificationDate> => {
                if (data.notifiedOn) {
                  return project.setNotificationDate(null, data.notifiedOn)
                }

                return ok(null)
              })
          },
          { isNew: true }
        )
      }

      return projectRepo.transaction(new UniqueEntityID(projectIdOrNull), (project) => {
        return project.reimport({ data, importId })
      })
    })

    if (res.isErr()) {
      console.error('handleProjectRawDataImported error', res.error)
    }
  }
