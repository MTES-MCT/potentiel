import { Repository, UniqueEntityID } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { FileObject, makeFileObject } from '../../file'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  IncompleteDataError,
  InfraNotAvailableError,
  OtherError,
} from '../../shared/errors'
import { IllegalProjectDataError, ProjectNotEligibleForCertificateError } from '../errors'
import { Project } from '../Project'

export type GenerateCertificate = (
  projectId: string,
  reason?: string
) => ResultAsync<
  null,
  | EntityNotFoundError
  | InfraNotAvailableError
  | IncompleteDataError
  | ProjectNotEligibleForCertificateError
  | OtherError
  | AggregateHasBeenUpdatedSinceError
>

/* global NodeJS */
interface GenerateCertificateDeps {
  fileRepo: Repository<FileObject>
  projectRepo: Repository<Project>
  buildCertificate: ({
    template: CertificateTemplate,
    data: ProjectDataForCertificate,
  }) => ResultAsync<
    NodeJS.ReadableStream,
    | IllegalProjectDataError
    | OtherError
    | EntityNotFoundError
    | IncompleteDataError
    | AggregateHasBeenUpdatedSinceError
    | ProjectNotEligibleForCertificateError
    | InfraNotAvailableError
  >
}
export const makeGenerateCertificate = (deps: GenerateCertificateDeps): GenerateCertificate => (
  projectId,
  reason
) => {
  return deps.projectRepo
    .load(new UniqueEntityID(projectId))
    .andThen(_buildCertificateForProject)
    .andThen(_saveCertificateToStorage)
    .andThen(_addCertificateFileIdToProject)
    .andThen((project) => deps.projectRepo.save(project))

  function _buildCertificateForProject(project: Project) {
    return project.certificateData
      .asyncAndThen((certificateData) => deps.buildCertificate(certificateData))
      .map((fileStream) => ({ fileStream, project }))
  }

  function _saveCertificateToStorage(args: {
    fileStream: NodeJS.ReadableStream
    project: Project
  }) {
    const { fileStream, project } = args
    return makeFileObject({
      filename: project.certificateFilename,
      contents: fileStream,
      forProject: new UniqueEntityID(projectId),
      designation: 'attestation-designation',
    })
      .mapErr((e) => new OtherError(e.message))
      .asyncAndThen((file: FileObject) => {
        return deps.fileRepo.save(file).map(() => file.id.toString())
      })
      .map((certificateFileId) => ({ certificateFileId, project }))
  }

  function _addCertificateFileIdToProject(args: { certificateFileId: string; project: Project }) {
    const { certificateFileId, project } = args
    return project
      .addGeneratedCertificate({
        projectVersionDate: project.lastUpdatedOn || new Date(),
        certificateFileId,
        reason,
      })
      .map(() => project)
  }
}
