import { DomainEvent, EventBus, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, ResultAsync, wrapInfra, ok, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectDCRSubmitted, ProjectPTFSubmitted } from '../events'

interface SubmitStepDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  eventBus: EventBus
}

type SubmitStepArgs = {
  type: 'ptf' | 'dcr'
  projectId: string
  stepDate: Date
  numeroDossier?: string
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeSubmitStep =
  (deps: SubmitStepDeps) =>
  (args: SubmitStepArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { type, projectId, file, submittedBy } = args
    const { filename, contents } = file

    return wrapInfra(deps.shouldUserAccessProject({ projectId, user: submittedBy }))
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
            .asyncAndThen((file) => deps.fileRepo.save(file).map(() => file.id.toString()))
            .mapErr((e: Error) => {
              logger.error(e)
              return new InfraNotAvailableError()
            })

          return res
        }
      )
      .andThen((fileId: string): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        return okAsync(fileId).andThen((fileId) =>
          deps.eventBus.publish(EventByType[type](args, fileId))
        )
      })
  }

const EventByType: Record<
  SubmitStepArgs['type'],
  (args: SubmitStepArgs, fileId: string) => DomainEvent
> = {
  dcr: ({ projectId, stepDate, submittedBy, numeroDossier }, fileId) =>
    new ProjectDCRSubmitted({
      payload: {
        projectId,
        dcrDate: stepDate,
        fileId,
        submittedBy: submittedBy.id,
        numeroDossier: numeroDossier || '',
      },
    }),
  ptf: ({ projectId, stepDate, submittedBy }, fileId) =>
    new ProjectPTFSubmitted({
      payload: {
        projectId,
        ptfDate: stepDate,
        fileId,
        submittedBy: submittedBy.id,
      },
    }),
}
