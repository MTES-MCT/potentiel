import { errAsync } from 'neverthrow'
import { Repository, UniqueEntityID } from '../../../core/domain'
import { logger, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectPTFSubmitted } from '../events'

interface SubmitPTFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  eventBus: EventBus
}

interface SubmitPTFArgs {
  projectId: string
  ptfDate: Date
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeSubmitPTF = (deps: SubmitPTFDeps) => ({
  projectId,
  ptfDate,
  file,
  submittedBy,
}: SubmitPTFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
  const { filename, contents } = file

  return ResultAsync.fromPromise(
    deps.shouldUserAccessProject({ projectId, user: submittedBy }),
    (e: Error) => {
      logger.error(e)
      return new InfraNotAvailableError()
    }
  )
    .andThen(
      (userHasRightsToProject): ResultAsync<string, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

        const res = makeFileObject({
          designation: 'ptf',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(submittedBy.id),
          filename,
          contents,
        })
          .asyncAndThen((file) => deps.fileRepo.save(file).map(() => file.id.toString()))
          .mapErr((e: Error) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })

        return res
      }
    )
    .andThen((fileId) =>
      deps.eventBus.publish(
        new ProjectPTFSubmitted({
          payload: {
            projectId,
            ptfDate,
            fileId,
            submittedBy: submittedBy.id,
          },
        })
      )
    )
}
