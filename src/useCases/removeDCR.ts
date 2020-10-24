import { ProjectRepo } from '../dataAccess'
import { applyProjectUpdate, Project, User } from '../entities'
import { EventStore } from '../modules/eventStore'
import { ProjectDCRRemoved } from '../modules/project/events'
import { Err, ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  eventStore: EventStore
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
}

interface CallUseCaseProps {
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED =
  "Vous n'avez pas le droit de retirer la demande complète de raccordement pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeRemoveDCR({
  eventStore,
  findProjectById,
  saveProject,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function removeDCR({ projectId, user }: CallUseCaseProps): ResultAsync<null> {
    if (user.role !== 'porteur-projet' || !(await shouldUserAccessProject({ user, projectId })))
      return ErrorResult(UNAUTHORIZED)

    const project = await findProjectById(projectId)

    if (!project) {
      console.log('removeDCR failed because project could not be found')
      return ErrorResult(UNAUTHORIZED)
    }

    if (!project.dcrSubmittedOn) {
      // No DCR for this project, ignore command
      return Ok(null)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        dcrDate: 0,
        dcrFileId: undefined,
        dcrNumeroDossier: undefined,
        dcrSubmittedOn: 0,
        dcrSubmittedBy: undefined,
      },
      context: {
        userId: user.id,
        type: 'dcr-removal',
      },
    })

    if (!updatedProject) {
      // OOPS
      console.log('removeDCR use-case: applyProjectUpdate returned null')

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await saveProject(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    await eventStore.publish(
      new ProjectDCRRemoved({
        payload: {
          projectId: project.id,
          removedBy: user.id,
        },
      })
    )

    return Ok(null)
  }
}
