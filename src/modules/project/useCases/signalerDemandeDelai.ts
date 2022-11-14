import { Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import {
  DélaiCDC2022DéjàAppliquéError,
  ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from '../errors'
import { Project } from '../Project'

type SignalerDemandeDelaiDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  projectRepo: TransactionalRepository<Project>
}

type SignalerDemandeDelaiArgs = {
  projectId: string
  decidedOn: Date
  signaledBy: User
  notes?: string
  file?: {
    contents: FileContents
    filename: string
  }
} & (
  | {
      status: 'acceptée'
      newCompletionDueOn: Date
      délaiCdc2022?: true
    }
  | {
      status: 'rejetée' | 'accord-de-principe'
    }
)

export const makeSignalerDemandeDelai =
  (deps: SignalerDemandeDelaiDeps) =>
  (
    args: SignalerDemandeDelaiArgs
  ): ResultAsync<
    null,
    | InfraNotAvailableError
    | UnauthorizedError
    | ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError
    | DélaiCDC2022DéjàAppliquéError
  > => {
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

          if (
            status === 'acceptée' &&
            args.délaiCdc2022 &&
            !['admin', 'dgec-validateur'].includes(signaledBy.role)
          ) {
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
            if (status === 'acceptée' && args.délaiCdc2022) {
              const { cahierDesCharges, délaiCDC2022appliqué } = project
              if (
                cahierDesCharges.type === 'initial' ||
                (cahierDesCharges.type === 'modifié' && cahierDesCharges.paruLe !== '30/08/2022')
              ) {
                return errAsync(new ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError())
              }
              if (délaiCDC2022appliqué) {
                return errAsync(new DélaiCDC2022DéjàAppliquéError())
              }
            }

            return project
              .signalerDemandeDelai({
                decidedOn,
                ...(status === 'acceptée'
                  ? {
                      status,
                      newCompletionDueOn: args.newCompletionDueOn,
                      ...(args.délaiCdc2022 && { délaiCdc2022: args.délaiCdc2022 }),
                    }
                  : { status }),
                notes,
                ...(attachment && { attachment }),
                signaledBy,
              })
              .asyncMap(async () => null)
          }
        )
      })
  }
