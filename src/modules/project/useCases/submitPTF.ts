import { TransactionalRepository, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, ResultAsync, wrapInfra, okAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { PTFCertificatDéjàEnvoyéError, ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { Project } from '../Project'

interface SubmitPTFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type SubmitPTFArgs = {
  type: 'ptf'
  projectId: string
  stepDate: Date
  file: {
    contents: FileContents
    filename: string
  }
  submittedBy: User
}

export const makeSubmitPTF =
  ({ shouldUserAccessProject, fileRepo, projectRepo }: SubmitPTFDeps) =>
  ({
    type,
    projectId,
    file,
    stepDate,
    submittedBy,
  }: SubmitPTFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
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
          InfraNotAvailableError | UnauthorizedError | PTFCertificatDéjàEnvoyéError
        > =>
          projectRepo.transaction(
            new UniqueEntityID(projectId),
            (
              project: Project
            ): ResultAsync<
              null,
              ProjectCannotBeUpdatedIfUnnotifiedError | PTFCertificatDéjàEnvoyéError
            > =>
              project
                .submitPropositionTechniqueFinancière({
                  projectId,
                  ptfDate: stepDate,
                  fileId,
                  submittedBy: submittedBy.id.toString(),
                })
                .asyncMap(async () => null)
          )
      )
  }
