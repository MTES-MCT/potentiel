import { logger } from '../core/utils'
import { ProjectRepo } from '../dataAccess'
import { applyProjectUpdate, Project, User } from '../entities'
import { EventBus } from '../modules/eventStore'
import { ProjectGFRemoved } from '../modules/project/events'
import { Err, ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  eventBus: EventBus
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
}

interface CallUseCaseProps {
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED =
  "Vous n'avez pas le droit de retirer les garanties financières pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeRemoveGarantiesFinancieres({
  eventBus,
  findProjectById,
  saveProject,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function removeGarantiesFinancieres({
    projectId,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    if (user.role !== 'porteur-projet' || !(await shouldUserAccessProject({ user, projectId })))
      return ErrorResult(UNAUTHORIZED)

    const project = await findProjectById(projectId)

    if (!project) {
      logger.error('removeGarantiesFinancieres failed because project could not be found')
      return ErrorResult(UNAUTHORIZED)
    }

    if (!project.garantiesFinancieresSubmittedOn) {
      // No garanties financieres for this project, ignore command
      return Ok(null)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        garantiesFinancieresDate: 0,
        garantiesFinancieresFileId: undefined,
        garantiesFinancieresSubmittedOn: 0,
        garantiesFinancieresSubmittedBy: undefined,
      },
      context: {
        userId: user.id,
        type: 'garanties-financieres-removal',
      },
    })

    if (!updatedProject) {
      logger.error('removeGarantiesFinancieres use-case: applyProjectUpdate returned null')

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await saveProject(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    await eventBus.publish(
      new ProjectGFRemoved({
        payload: {
          projectId: project.id,
          removedBy: user.id,
        },
      })
    )

    return Ok(null)
  }
}
