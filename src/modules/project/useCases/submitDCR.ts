import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, ResultAsync, wrapInfra, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { DCRCertificatDejaEnvoyéError, ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { Project } from '../Project'
interface SubmitDCRDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type SubmitDCRArgs = {
  type: 'dcr'
  projectId: string
  stepDate: Date
  numeroDossier: string
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeSubmitDCR =
  ({ shouldUserAccessProject, fileRepo, projectRepo }: SubmitDCRDeps) =>
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
      .andThen(
        (
          fileId: string
        ): ResultAsync<
          null,
          InfraNotAvailableError | UnauthorizedError | DCRCertificatDejaEnvoyéError
        > => {
          return projectRepo.transaction(
            new UniqueEntityID(projectId),
            (
              project: Project
            ): ResultAsync<
              null,
              ProjectCannotBeUpdatedIfUnnotifiedError | DCRCertificatDejaEnvoyéError
            > => {
              return project
                .submitDemandeComplèteRaccordement({
                  projectId,
                  dcrDate: stepDate,
                  fileId,
                  numeroDossier,
                  submittedBy: submittedBy.id.toString(),
                })
                .asyncMap(async () => null)
            }
          )
        }
      )
  }
