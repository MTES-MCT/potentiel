import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, ok, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { GFCertificateHasAlreadyBeenSentError } from '../errors/GFCertificateHasAlreadyBeenSent'
import { Project } from '../Project'

type SignalerDemandeDelaiDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type SignalerDemandeDelaiArgs = {
  projectId: string
  decidedOn: number
  isAccepted: boolean
  newCompletionDueOn: number
  signaledBy: User
  file?: {
    contents: FileContents
    filename: string
  }
}

export const makeSignalerDemandeDelai =
  (deps: SignalerDemandeDelaiDeps) =>
  (
    args: SignalerDemandeDelaiArgs
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projectRepo, shouldUserAccessProject } = deps
    const { projectId, decidedOn, newCompletionDueOn, isAccepted, signaledBy } = args

    return wrapInfra(shouldUserAccessProject({ projectId, user: signaledBy })).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())

        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (
            project: Project
          ): ResultAsync<
            null,
            ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError
          > => {
            return project
              .signalerDemandeDelai({
                decidedOn: new Date(decidedOn),
                newCompletionDueOn: new Date(newCompletionDueOn),
                isAccepted,
                signaledBy,
              })
              .asyncMap(async () => null)
          }
        )
      }
    )
  }
