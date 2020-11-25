import { Repository, UniqueEntityID } from '../core/domain'
import { ProjectRepo } from '../dataAccess'
import { applyProjectUpdate, Project, User } from '../entities'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { EventBus } from '../modules/eventStore'
import { FileContents, FileObject, makeFileObject } from '../modules/file'
import { ProjectDCRSubmitted } from '../modules/project/events'
import { Err, ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  eventBus: EventBus
  fileRepo: Repository<FileObject>
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
}

interface CallUseCaseProps {
  file: {
    contents: FileContents
    filename: string
  }
  numeroDossier: string
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED = "Vous n'avez pas de droits pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeAddDCR({
  eventBus,
  fileRepo,
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

    const { contents, filename } = file

    const fileIdResult = await makeFileObject({
      designation: 'dcr',
      forProject: new UniqueEntityID(project.id),
      createdBy: new UniqueEntityID(user.id),
      filename,
      contents,
    }).asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))

    if (fileIdResult.isErr()) {
      console.error('addDCR use-case: failed to save file', fileIdResult.error)
      return ErrorResult(SYSTEM_ERROR)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        dcrDate: date,
        dcrFileId: fileIdResult.value.toString(),
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

    await eventBus.publish(
      new ProjectDCRSubmitted({
        payload: {
          projectId: project.id,
          dcrDate: new Date(date),
          fileId: fileIdResult.value.toString(),
          numeroDossier: numeroDossier,
          submittedBy: user.id,
        },
      })
    )

    return Ok(null)
  }
}
