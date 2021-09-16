import { FindProjectByIdentifiers, makeProject } from '..'
import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { ok, ResultAsync } from '../../../core/utils'
import { appelsOffreStatic } from '../../../dataAccess/inMemory'
import { AppelOffre } from '../../../entities'
import { InfraNotAvailableError } from '../../shared'
import { ProjectRawDataImported } from '../events'
import { Project } from '../Project'

const appelsOffres: Record<AppelOffre['id'], AppelOffre> = appelsOffreStatic.reduce(
  (map, appelOffre) => {
    map[appelOffre.id] = appelOffre
    return map
  },
  {}
)

export const handleProjectRawDataImported = (deps: {
  findProjectByIdentifiers: FindProjectByIdentifiers
  projectRepo: TransactionalRepository<Project> & Repository<Project>
}) => async (event: ProjectRawDataImported): Promise<ResultAsync<null, InfraNotAvailableError>> => {
  const { findProjectByIdentifiers, projectRepo } = deps

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
        return makeProject({ projectId: new UniqueEntityID(), appelsOffres }).asyncAndThen(
          (project) => {
            return project
              .import({ data, importId })
              .andThen(
                (): ReturnType<typeof project.setNotificationDate> => {
                  if (data.notifiedOn) {
                    console.log('notified')
                    return project.setNotificationDate(null, data.notifiedOn)
                  }

                  return ok(null)
                }
              )
              .asyncAndThen(() => projectRepo.save(project))
          }
        )
      }

      return projectRepo.transaction(new UniqueEntityID(projectIdOrNull), (project) => {
        return project.reimport({ data, importId })
      })
    }
  )
}
