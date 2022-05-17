import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { Project } from '../Project'

type SignalerDemandeRecoursDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type SignalerDemandeRecoursArgs = {
  projectId: string
  decidedOn: Date
  signaledBy: User
  notes?: string
  file?: {
    contents: FileContents
    filename: string
  }
  status: 'acceptée' | 'rejetée'
}

export const makeSignalerDemandeRecours =
  (deps: SignalerDemandeRecoursDeps) =>
  (
    args: SignalerDemandeRecoursArgs
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projectRepo, fileRepo, shouldUserAccessProject } = deps
    const { projectId, decidedOn, status, notes, signaledBy, file } = args

    return wrapInfra(shouldUserAccessProject({ projectId, user: signaledBy }))
      .andThen(
        (
          userHasRightsToProject
        ): ResultAsync<
          { id: string; name: string } | null,
          InfraNotAvailableError | UnauthorizedError
        > => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError())
          }

          if (file) {
            const { filename, contents } = file
            const fileObject = makeFileObject({
              designation: 'other',
              forProject: new UniqueEntityID(projectId),
              createdBy: new UniqueEntityID(signaledBy.id),
              filename,
              contents,
            })
              .asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
              .map((fileId) => ({ id: fileId, name: filename }))
              .mapErr((e: Error) => {
                logger.error(e)
                return new InfraNotAvailableError()
              })

            return fileObject
          }

          return okAsync(null)
        }
      )
      .andThen((attachment) => {
        return projectRepo.transaction(
          new UniqueEntityID(projectId),
          (project: Project): ResultAsync<null, ProjectCannotBeUpdatedIfUnnotifiedError> => {
            return project
              .signalerDemandeRecours({
                decidedOn: decidedOn,
                status,
                notes,
                ...(attachment && { attachment }),
                signaledBy,
              })
              .asyncMap(async () => null)
          }
        )
      })
  }
