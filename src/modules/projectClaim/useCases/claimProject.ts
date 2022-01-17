import { err, logger, ok, Result, ResultAsync } from '@core/utils'
import { User } from '../../../entities'
import { AggregateHasBeenUpdatedSinceError } from '../../shared'
import { EventBus, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { FileContents, FileObject, IllegalFileDataError, makeFileObject } from '../../file'
import { makeClaimProjectAggregateId } from '../helpers'
import { ProjectClaim } from '../ProjectClaim'
import { GetProjectDataForProjectClaim } from '../../project/queries/GetProjectDataForProjectClaim'
import { ProjectClaimFailed } from '../events'
import { ClaimerIdentityCheckHasFailedError } from '..'

interface ClaimProjectDeps {
  projectClaimRepo: TransactionalRepository<ProjectClaim>
  fileRepo: Repository<FileObject>
  getProjectDataForProjectClaim: GetProjectDataForProjectClaim
  eventBus: EventBus
}

interface ClaimProjectArgs {
  projectId: string
  claimedBy: User
  prix?: number
  numeroCRE?: string
  attestationDesignationProofFile?: {
    contents: FileContents
    filename: string
  }
}

export const makeClaimProject = (deps: ClaimProjectDeps) => async (args: ClaimProjectArgs) => {
  const { projectId, prix, numeroCRE, claimedBy, attestationDesignationProofFile } = args
  const { projectClaimRepo, getProjectDataForProjectClaim, fileRepo, eventBus } = deps

  const fileObject: Result<
    FileObject | null,
    IllegalFileDataError
  > = attestationDesignationProofFile
    ? makeFileObject({
        designation: 'attestation-designation-proof',
        forProject: new UniqueEntityID(projectId),
        createdBy: new UniqueEntityID(claimedBy.id),
        filename: attestationDesignationProofFile.filename,
        contents: attestationDesignationProofFile.contents,
      })
    : ok(null)

  const projectClaimAggregateId = new UniqueEntityID(
    makeClaimProjectAggregateId({ projectId, claimedBy: claimedBy.id })
  )

  return fileObject.andThen((fileObj): any => {
    return projectClaimRepo
      .transaction(
        projectClaimAggregateId,
        (
          projectClaim
        ): ResultAsync<
          string,
          Error | AggregateHasBeenUpdatedSinceError | ClaimerIdentityCheckHasFailedError
        > => {
          return getProjectDataForProjectClaim(projectId).andThen((project) =>
            projectClaim.claim({
              projectEmail: project.email,
              claimerEmail: claimedBy.email,
              userInputs: {
                prix,
                numeroCRE,
              },
              projectData: project,
              attestationDesignationFileId: fileObj?.id.toString(),
            })
          )
        },
        { acceptNew: true }
      )
      .orElse((error) => {
        logger.info(error.message)

        if (error instanceof ClaimerIdentityCheckHasFailedError) {
          eventBus.publish(
            new ProjectClaimFailed({
              payload: {
                projectId,
                claimedBy: claimedBy.id,
              },
            })
          )
        }

        return err(error.message)
      })
      .andThen((projectName: string) => {
        if (fileObj) {
          return fileRepo.save(fileObj).map(() => projectName)
        }

        return ok(projectName)
      })
  })
}
