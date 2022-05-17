import { TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import {
  GFAlreadyHasExpirationDateError,
  NoGFCertificateToUpdateError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from '../errors'
import { Project } from '../Project'

type addGFExpidationDateDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: TransactionalRepository<Project>
}

type addGFExpidationDateArgs = {
  expirationDate: Date
  submittedBy: User
  projectId: string
}

export const makeAddGFExpirationDate =
  (deps: addGFExpidationDateDeps) =>
  (
    args: addGFExpidationDateArgs
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { shouldUserAccessProject, projectRepo } = deps
    const { expirationDate, submittedBy, projectId } = args

    return wrapInfra(shouldUserAccessProject({ projectId, user: submittedBy })).andThen(
      (userHasRights): ResultAsync<null, UnauthorizedError> => {
        if (!userHasRights) return errAsync(new UnauthorizedError())
        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (
            project: Project
          ): ResultAsync<
            null,
            | ProjectCannotBeUpdatedIfUnnotifiedError
            | NoGFCertificateToUpdateError
            | GFAlreadyHasExpirationDateError
          > => {
            return project
              .addGFExpirationDate({ expirationDate, submittedBy, projectId })
              .asyncMap(async () => null)
          }
        )
      }
    )
  }
