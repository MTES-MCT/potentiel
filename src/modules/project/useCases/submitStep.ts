import { Repository, UniqueEntityID } from '../../../core/domain'
import { logger, ResultAsync, okAsync, errAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectPTFSubmitted } from '../events'

interface SubmitStepDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  eventBus: EventBus
}

type SubmitStepArgs = {
  type: 'ptf'
  projectId: string
  stepDate: Date
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeSubmitStep = (deps: SubmitStepDeps) => ({
  type,
  projectId,
  stepDate,
  file,
  submittedBy,
}: SubmitStepArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
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
          designation: type,
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
      type === 'ptf'
        ? deps.eventBus.publish(
            new ProjectPTFSubmitted({
              payload: {
                projectId,
                ptfDate: stepDate,
                fileId,
                submittedBy: submittedBy.id,
              },
            })
          )
        : okAsync(null)
    )
}
