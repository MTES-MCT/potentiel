import { EventBus, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, ResultAsync, wrapInfra, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectDCRSubmitted } from '../events'

interface SubmitDCRDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  eventBus: EventBus
}

type SubmitDCRArgs = {
  type: 'dcr'
  projectId: string
  stepDate: Date
  numeroDossier?: string
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeSubmitDCR =
  ({ shouldUserAccessProject, fileRepo, eventBus }: SubmitDCRDeps) =>
  ({
    type,
    projectId,
    stepDate,
    numeroDossier,
    file,
    submittedBy,
  }: SubmitDCRArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { filename, contents } = file

    return wrapInfra(shouldUserAccessProject({ projectId, user: submittedBy }))
      .andThen(
        (
          userHasRightsToProject
        ): ResultAsync<string, InfraNotAvailableError | UnauthorizedError> => {
          if (!userHasRightsToProject) return errAsync(new UnauthorizedError())
          const res = makeFileObject({
            designation: type,
            forProject: new UniqueEntityID(projectId),
            createdBy: new UniqueEntityID(submittedBy.id),
            filename,
            contents,
          })
            .asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
            .mapErr((e: Error) => {
              logger.error(e)
              return new InfraNotAvailableError()
            })

          return res
        }
      )
      .andThen((fileId: string): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        return okAsync(fileId).andThen((fileId) =>
          eventBus.publish(
            new ProjectDCRSubmitted({
              payload: {
                projectId,
                dcrDate: stepDate,
                fileId,
                submittedBy: submittedBy.id,
                numeroDossier: numeroDossier || '',
              },
            })
          )
        )
      })
  }
