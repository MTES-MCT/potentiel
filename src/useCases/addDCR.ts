import { Project, User, applyProjectUpdate } from '../entities'
import { ProjectRepo } from '../dataAccess'
import { FileService, File, FileContainer } from '../modules/file'
import { ResultAsync, Ok, Err, ErrorResult } from '../types'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { EventStore } from '../modules/eventStore'
import { ProjectDCRSubmitted } from '../modules/project/events'

interface MakeUseCaseProps {
  eventStore: EventStore
  fileService: FileService
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
}

interface CallUseCaseProps {
  file: FileContainer
  numeroDossier: string
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED = "Vous n'avez pas de droits pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeAddDCR({
  eventStore,
  fileService,
  findProjectById,
  saveProject,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function addDCR({
    file,
    numeroDossier,
    date,
    projectId,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    const access = await shouldUserAccessProject({ user, projectId })

    if (!access) return ErrorResult(UNAUTHORIZED)

    const project = await findProjectById(projectId)

    if (!project) {
      console.log('addDCR failed because projectRes.is_none()')
      return ErrorResult(UNAUTHORIZED)
    }

    const fileResult = File.create({
      designation: 'dcr',
      forProject: project.id,
      createdBy: user.id,
      filename: file.path,
    })

    if (fileResult.isErr()) {
      console.log('addDCR use-case: File.create failed', fileResult.error)

      return ErrorResult(SYSTEM_ERROR)
    }

    const saveFileResult = await fileService.save(fileResult.value, {
      ...file,
      path: makeProjectFilePath(projectId, file.path).filepath,
    })

    if (saveFileResult.isErr()) {
      // OOPS
      console.log('addDCR use-case: fileService.save failed', saveFileResult.error)

      return ErrorResult(SYSTEM_ERROR)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        dcrDate: date,
        dcrFileId: fileResult.value.id.toString(),
        dcrNumeroDossier: numeroDossier,
        dcrSubmittedOn: Date.now(),
        dcrSubmittedBy: user.id,
      },
      context: {
        userId: user.id,
        type: 'dcr-submission',
      },
    })

    if (!updatedProject) {
      // OOPS
      console.log('addDCR use-case: applyProjectUpdate returned null')

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await saveProject(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    await eventStore.publish(
      new ProjectDCRSubmitted({
        payload: {
          projectId: project.id,
          dcrDate: new Date(date),
          fileId: fileResult.value.id.toString(),
          numeroDossier: numeroDossier,
          submittedBy: user.id,
        },
      })
    )

    return Ok(null)
  }
}
