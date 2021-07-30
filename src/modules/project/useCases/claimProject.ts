import { errAsync, logger, okAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { AggregateHasBeenUpdatedSinceError, InfraNotAvailableError } from '../../shared'
import { Repository, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { Project } from '..'
import { UserRepo } from '../../../dataAccess'
import { FileContents, FileObject, makeFileObject } from '../../file'

interface ClaimProjectDeps {
  projectRepo: TransactionalRepository<Project>
  userRepo: UserRepo
  fileRepo: Repository<FileObject>
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
  const { projectRepo, userRepo } = deps

  return projectRepo.transaction(
    new UniqueEntityID(projectId),
    (project): ResultAsync<any, null | AggregateHasBeenUpdatedSinceError> => {
      const projectName = project.data?.nomProjet

      if (project.data?.email === claimedBy.email) {
        return wrapInfra(userRepo.addProject(claimedBy.id, projectId))
          .andThen(() => project.claimProjectByOwner(claimedBy))
          .andThen(() => okAsync(projectName))
      }

      if (!attestationDesignationProofFile) {
        logger.info(`([${project.id}] ${projectName}) L'attestation de désignation est manquante.`)
        return errAsync(
          new Error(`[Projet ${projectName}] - L'attestation de désignation est manquante.`)
        )
      }

      const userDataAreOk = _checkUserDataAreCorrect({ prix, codePostal }, project)

      if (!userDataAreOk) {
        //TODO : counter++
        const remainingTries = 2
        return errAsync(
          new Error(`[Projet ${projectName}] Nombre d'essais restants : ${remainingTries}`)
        )
      }

      if (!attestationDesignationProofFile) return errAsync(null)
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
          return wrapInfra(userRepo.addProject(claimedBy.id, projectId))
            .andThen(() => project.claimProject(claimedBy, certificateFileId))
            .andThen(() => okAsync(projectName))
        })
    }
  )
}

function _checkUserDataAreCorrect(
  userData: { prix?: number; codePostal?: string },
  project: Project
): boolean {
  const { prix, codePostal } = userData
  const projectInfo = `[${project.id}] ${project.data?.nomProjet}`

  if (prix !== project.data?.prixReference) {
    logger.info(`(${projectInfo}) Le prix renseigné ne correspond pas à celui du projet.`)
    return false
  }

  if (codePostal !== project.data?.codePostalProjet) {
    logger.info(`(${projectInfo}) Le prix renseigné ne correspond pas à celui du projet.`)
    return false
  }

  return true
}
