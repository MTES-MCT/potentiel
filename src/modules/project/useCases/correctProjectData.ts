import { DomainError, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { okAsync, errAsync, ResultAsync, ok, Result, err } from '../../../core/utils'
import { User } from '../../../entities'
import { makeProjectFilePath } from '../../../helpers/makeProjectFilePath'
import { FileContainer, FileService, File } from '../../file'
import {
  EntityNotFoundError,
  InfraNotAvailableError,
  OtherError,
  UnauthorizedError,
} from '../../shared'
import { IllegalProjectDataError, ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { ProjectHasBeenUpdatedSinceError } from '../errors/ProjectHasBeenUpdatedSinceError'
import { GenerateCertificate } from './generateCertificate'
import { Project } from '../Project'

interface CorrectProjectDataDeps {
  projectRepo: TransactionalRepository<Project>
  fileService: FileService
  generateCertificate: GenerateCertificate
}

interface CorrectProjectDataArgs {
  projectId: string
  certificateFile?: FileContainer
  projectVersionDate: Date
  newNotifiedOn: number
  user: User
  shouldGrantClasse: boolean
  correctedData: Partial<{
    numeroCRE: string
    appelOffreId: string
    periodeId: string
    familleId: string
    nomProjet: string
    territoireProjet: string
    puissance: number
    prixReference: number
    evaluationCarbone: number
    note: number
    nomCandidat: string
    nomRepresentantLegal: string
    email: string
    adresseProjet: string
    codePostalProjet: string
    communeProjet: string
    engagementFournitureDePuissanceAlaPointe: boolean
    isFinancementParticipatif: boolean
    isInvestissementParticipatif: boolean
    motifsElimination: string
  }>
}

type CorrectProjectDataError =
  | InfraNotAvailableError
  | EntityNotFoundError
  | ProjectHasBeenUpdatedSinceError
  | UnauthorizedError
  | ProjectCannotBeUpdatedIfUnnotifiedError
  | IllegalProjectDataError
  | OtherError

export type CorrectProjectData = (
  args: CorrectProjectDataArgs
) => ResultAsync<null, CorrectProjectDataError>

export const makeCorrectProjectData = (deps: CorrectProjectDataDeps): CorrectProjectData => ({
  projectId,
  certificateFile,
  projectVersionDate,
  newNotifiedOn,
  user,
  correctedData,
  shouldGrantClasse,
}) => {
  if (!user || !['admin', 'dgec'].includes(user.role)) {
    return errAsync(new UnauthorizedError())
  }

  return _uploadFileIfExists().andThen((certificateFileId) => {
    // open a transaction on the project to update it
    // the transaction will return a boolean for shouldCertificateBeGenerated
    const projectTransaction = deps.projectRepo.transaction(
      new UniqueEntityID(projectId),
      (
        project: Project
      ): Result<
        boolean,
        | ProjectHasBeenUpdatedSinceError
        | ProjectCannotBeUpdatedIfUnnotifiedError
        | IllegalProjectDataError
      > => {
        if (project.lastUpdatedOn > projectVersionDate) {
          return err(new ProjectHasBeenUpdatedSinceError())
        }

        return _addCertificateToProjectIfExists(certificateFileId, project)
          .andThen(() => _grantClasseIfNecessary(project))
          .andThen(() => project.correctData(user, correctedData))
          .andThen(() => project.setNotificationDate(user, newNotifiedOn))
          .map((): boolean => project.shouldCertificateBeGenerated)
      }
    )

    // If shouldCertificateBeGenerated, generate a new certificate
    return projectTransaction.andThen((shouldCertificateBeGenerated) => {
      return shouldCertificateBeGenerated
        ? deps.generateCertificate(projectId).map(() => null)
        : okAsync<null, CorrectProjectDataError>(null)
    })
  })

  function _grantClasseIfNecessary(project: Project): Result<null, never> {
    return shouldGrantClasse ? project.grantClasse(user) : ok(null)
  }
  function _addCertificateToProjectIfExists(
    certificateFileId: string | null,
    project: Project
  ): Result<null, ProjectCannotBeUpdatedIfUnnotifiedError> {
    return certificateFileId ? project.uploadCertificate(user, certificateFileId) : ok(null)
  }

  function _uploadFileIfExists(): ResultAsync<string | null, OtherError | DomainError> {
    if (!certificateFile) return okAsync(null)

    const fileResult = File.create({
      designation: 'garantie-financiere',
      forProject: projectId,
      createdBy: user.id,
      filename: certificateFile.path,
    })

    if (fileResult.isErr()) {
      console.log('correctProjectData command: File.create failed', fileResult.error)

      return errAsync(new OtherError())
    }

    const certificateFileId = fileResult.value.id.toString()

    return deps.fileService
      .save(fileResult.value, {
        ...certificateFile,
        path: makeProjectFilePath(projectId, certificateFile.path).filepath,
      })
      .map(() => certificateFileId)
  }
}
