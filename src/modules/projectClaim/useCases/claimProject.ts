import { errAsync, logger, okAsync, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { AggregateHasBeenUpdatedSinceError, InfraNotAvailableError } from '../../shared'
import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { UserRepo } from '../../../dataAccess'
import { FileContents, FileObject, makeFileObject } from '../../file'
import { ProjectClaim } from '../ProjectClaim'
import { GetProjectDataForProjectClaim } from '../../project/queries/GetProjectDataForProjectClaim'
import { ProjectDataForProjectClaim } from '../../project/dtos'

interface ClaimProjectDeps {
  projectClaimRepo: TransactionalRepository<ProjectClaim>
  userRepo: UserRepo
  fileRepo: Repository<FileObject>
  getProjectDataForProjectClaim: GetProjectDataForProjectClaim
}

interface ClaimProjectArgs {
  projectId: string
  claimedBy: User
  prix?: number
  codePostal?: string
  attestationDesignationProofFile?: {
    contents: FileContents
    filename: string
  }
}

export const makeClaimProject = (deps: ClaimProjectDeps) => async (args: ClaimProjectArgs) => {
  const { projectId, prix, codePostal, claimedBy, attestationDesignationProofFile } = args
  const { projectClaimRepo, getProjectDataForProjectClaim } = deps

  return projectClaimRepo.transaction(
    new UniqueEntityID(projectId),
    (projectClaim): ResultAsync<string, Error | AggregateHasBeenUpdatedSinceError> => {
      return getProjectDataForProjectClaim(projectId).andThen((project) => {
        const { nomProjet: projectName } = project

        if (project.email === claimedBy.email) {
          return projectClaim.claim({ claimerIsTheOwner: true }).andThen(() => okAsync(projectName))
        }

        if (!attestationDesignationProofFile) {
          logger.info(`([${projectId}] ${projectName}) L'attestation de désignation est manquante.`)
          return errAsync(
            new Error(`[Projet ${projectName}] - L'attestation de désignation est manquante.`)
          )
        }

        if (!prix || !codePostal) return

        const claimerInputsAreCorrect = _checkClaimerInputsAreCorrect({ prix, codePostal }, project)

        if (!claimerInputsAreCorrect) {
          return projectClaim.claim({ claimerInputsAreCorrect: false }).map(() => {})
        }

        if (!attestationDesignationProofFile) return errAsync(new Error('Attestation manquante')) // TODO
        const { filename, contents } = attestationDesignationProofFile

        return makeFileObject({
          designation: 'attestation-designation-proof',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(claimedBy.id),
          filename,
          contents,
        })
          .asyncAndThen((file) => {
            return deps.fileRepo.save(file).map(() => file.id.toString())
          })
          .mapErr((e: Error) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
          .andThen((certificateFileId) => {
            return projectClaim
              .claim({ attestationDesignationFileId: certificateFileId })
              .andThen(() => okAsync(projectName))
          })
      })
    }
  )
}

function _checkClaimerInputsAreCorrect(
  userInputs: { prix: number; codePostal: string },
  project: ProjectDataForProjectClaim
): boolean {
  const projectInfo = `[${project.id}] ${project.nomProjet}`

  if (userInputs.prix !== project.prixReference) {
    logger.info(`(${projectInfo}) Le prix renseigné ne correspond pas à celui du projet.`)
    return false
  }

  if (userInputs.codePostal !== project.codePostalProjet) {
    logger.info(`(${projectInfo}) Le prix renseigné ne correspond pas à celui du projet.`)
    return false
  }

  return true
}
