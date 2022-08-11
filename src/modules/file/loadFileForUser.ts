import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { Repository, UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { ShouldUserAccessProject } from '../authZ'
import { EntityNotFoundError, InfraNotAvailableError } from '../shared'
import { FileAccessDeniedError, FileNotFoundError } from './errors'
import { FileObject } from './FileObject'
import { GetFileProject } from './queries'

export interface LoadFileForUser {
  (args: { fileId: UniqueEntityID; user: User }): ResultAsync<
    FileObject,
    InfraNotAvailableError | FileNotFoundError | FileAccessDeniedError
  >
}

interface LoadFileForUserDeps {
  shouldUserAccessProject: ShouldUserAccessProject
  getFileProject: GetFileProject
  fileRepo: Repository<FileObject>
}

export const makeLoadFileForUser =
  (deps: LoadFileForUserDeps): LoadFileForUser =>
  ({ fileId, user }) => {
    return deps
      .getFileProject(fileId)
      .andThen(
        (
          projectId
        ): ResultAsync<
          boolean,
          FileAccessDeniedError | InfraNotAvailableError | FileNotFoundError
        > => {
          if (!projectId) {
            if (['admin', 'dgec'].includes(user.role)) {
              return okAsync(true)
            }

            return errAsync(new FileAccessDeniedError())
          }

          return wrapInfra(
            deps.shouldUserAccessProject.check({ projectId: projectId.toString(), user })
          )
        }
      )
      .andThen((userHasRightsToProject) => {
        if (userHasRightsToProject) {
          return deps.fileRepo
            .load(fileId)
            .mapErr((e) => (e instanceof EntityNotFoundError ? new FileNotFoundError() : e))
        }

        return errAsync(new FileAccessDeniedError())
      })
  }
